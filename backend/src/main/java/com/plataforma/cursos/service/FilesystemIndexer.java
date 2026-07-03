package com.plataforma.cursos.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.plataforma.cursos.model.Chapter;
import com.plataforma.cursos.model.Lesson;
import com.plataforma.cursos.model.Material;
import com.plataforma.cursos.model.MaterialType;
import com.plataforma.cursos.util.SlugUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Component
public class FilesystemIndexer {

    private static final Logger log = LoggerFactory.getLogger(FilesystemIndexer.class);

    private static final Pattern SECTION_FOLDER = Pattern.compile("^\\d+\\s*-\\s*.+");
    private static final Pattern LEADING_NUMBER = Pattern.compile("^(\\d+)[._\\-\\s]+(.+)$");

    private final String videosPath;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FilesystemIndexer(@Value("${videos.path}") String videosPath) {
        this.videosPath = videosPath;
    }

    /**
     * Cada subpasta direta de videos.path é UM curso (ex: "UniversoNarrado", "Quimica").
     * Dentro de cada curso, subpastas numeradas ("01 - Fundamentos...", "03 - Frente A")
     * são módulos, que por sua vez podem conter sub-módulos (ex: A01..A19 em "Frente A").
     */
    public List<CourseFolder> scan() {
        Path root = Paths.get(videosPath);
        if (!Files.isDirectory(root)) {
            log.warn("Videos path does not exist or is not a directory: {}", root);
            return List.of();
        }
        try (Stream<Path> entries = Files.list(root)) {
            return entries.filter(Files::isDirectory)
                    .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                    .map(this::scanCourseFolder)
                    .toList();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private CourseFolder scanCourseFolder(Path courseDir) {
        String folderName = courseDir.getFileName().toString();
        String slug = SlugUtils.slugify(folderName);
        List<ModuleFolder> modules = scanModules(courseDir, true);
        return new CourseFolder(folderName, slug, modules);
    }

    private List<ModuleFolder> scanModules(Path dir, boolean requireSectionPrefix) {
        try (Stream<Path> entries = Files.list(dir)) {
            return entries.filter(Files::isDirectory)
                    .filter(p -> !requireSectionPrefix || SECTION_FOLDER.matcher(p.getFileName().toString()).matches())
                    .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                    .map(this::scanModuleNode)
                    .toList();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private ModuleFolder scanModuleNode(Path moduleDir) {
        String folderName = moduleDir.getFileName().toString();
        String slug = SlugUtils.slugify(folderName);
        boolean isLeaf = Files.isDirectory(moduleDir.resolve("videos")) || Files.isDirectory(moduleDir.resolve("archives"));

        if (isLeaf) {
            List<Path> videoFiles = listFiles(moduleDir.resolve("videos"), ".mp4");
            List<Lesson> lessons = videoFiles.stream()
                    .map(this::parseLesson)
                    .sorted(Comparator.comparingInt(Lesson::order))
                    .toList();
            List<Material> localMaterials = listFiles(moduleDir.resolve("archives"), ".pdf").stream()
                    .map(this::parseMaterial)
                    .toList();
            List<Material> sidecarLinkMaterials = videoFiles.stream()
                    .flatMap(videoFile -> readSidecarLinkMaterials(videoFile).stream())
                    .toList();
            List<Material> materials = mergeMaterials(localMaterials, sidecarLinkMaterials);
            return new ModuleFolder(folderName, slug, moduleDir, lessons, materials, List.of());
        }

        List<ModuleFolder> children = scanModules(moduleDir, false);
        return new ModuleFolder(folderName, slug, moduleDir, List.of(), List.of(), children);
    }

    /** Materiais locais (achados em archives/) têm prioridade; links do sidecar completam, sem duplicar slug. */
    private List<Material> mergeMaterials(List<Material> localMaterials, List<Material> sidecarLinkMaterials) {
        Map<String, Material> bySlug = new LinkedHashMap<>();
        for (Material material : localMaterials) {
            bySlug.put(material.slug(), material);
        }
        for (Material material : sidecarLinkMaterials) {
            bySlug.putIfAbsent(material.slug(), material);
        }
        return List.copyOf(bySlug.values());
    }

    private List<Path> listFiles(Path dir, String extension) {
        if (!Files.isDirectory(dir)) {
            return List.of();
        }
        try (Stream<Path> entries = Files.list(dir)) {
            return entries.filter(Files::isRegularFile)
                    .filter(p -> p.getFileName().toString().toLowerCase().endsWith(extension))
                    .toList();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private Lesson parseLesson(Path videoFile) {
        String filename = videoFile.getFileName().toString();
        String nameWithoutExt = stripExtension(filename);
        Matcher matcher = LEADING_NUMBER.matcher(nameWithoutExt);
        int order;
        String rawTitle;
        if (matcher.matches()) {
            order = Integer.parseInt(matcher.group(1));
            rawTitle = matcher.group(2);
        } else {
            order = Integer.MAX_VALUE;
            rawTitle = nameWithoutExt;
            log.warn("Could not parse leading number from lesson filename: {}", filename);
        }
        String title = Normalizer.normalize(rawTitle.replace('_', ' ').trim(), Normalizer.Form.NFC);
        List<Chapter> chapters = readSidecar(videoFile).map(LessonSidecar::chapters).orElseGet(List::of);
        return new Lesson(SlugUtils.slugify(title), order, title, filename, chapters);
    }

    private Material parseMaterial(Path pdfFile) {
        String filename = pdfFile.getFileName().toString();
        String nameWithoutExt = stripExtension(filename);
        String title = Normalizer.normalize(nameWithoutExt, Normalizer.Form.NFC);
        String normalized = SlugUtils.slugify(title);
        MaterialType type;
        if (normalized.contains("teoria")) {
            type = MaterialType.TEORIA;
        } else if (normalized.contains("exercicio") || normalized.contains("gabarito")) {
            type = MaterialType.EXERCICIOS;
        } else {
            type = MaterialType.OTHER;
        }
        return new Material(SlugUtils.slugify(title), title, filename, type, null);
    }

    private List<Material> readSidecarLinkMaterials(Path videoFile) {
        return readSidecar(videoFile).map(LessonSidecar::materials).orElseGet(List::of).stream()
                .filter(m -> m.url() != null && !m.url().isBlank())
                .map(m -> new Material(m.slug(), m.title(), null, m.type(), m.url()))
                .toList();
    }

    /** Sidecar normalizado em "<mesmo-nome-do-vídeo>.meta.json", escrito pelo script de processamento. */
    private java.util.Optional<LessonSidecar> readSidecar(Path videoFile) {
        Path sidecarPath = videoFile.resolveSibling(stripExtension(videoFile.getFileName().toString()) + ".meta.json");
        if (!Files.isRegularFile(sidecarPath)) {
            return java.util.Optional.empty();
        }
        try {
            return java.util.Optional.of(objectMapper.readValue(sidecarPath.toFile(), LessonSidecar.class));
        } catch (IOException e) {
            log.warn("Falha ao ler sidecar {}: {}", sidecarPath, e.getMessage());
            return java.util.Optional.empty();
        }
    }

    private static String stripExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(0, dot) : filename;
    }

    public record CourseFolder(String folderName, String slug, List<ModuleFolder> moduleFolders) {
    }

    public record ModuleFolder(String folderName, String slug, Path moduleDir, List<Lesson> lessons,
                                List<Material> materials, List<ModuleFolder> children) {
    }

    /** Espelha o .meta.json escrito por backend/scripts/process_chapters.py. */
    public record LessonSidecar(String sourceVideoId, List<Chapter> chapters, List<SidecarMaterial> materials) {
        public LessonSidecar {
            if (chapters == null) {
                chapters = List.of();
            }
            if (materials == null) {
                materials = List.of();
            }
        }
    }

    public record SidecarMaterial(MaterialType type, String title, String slug, String filename, String url) {
    }
}

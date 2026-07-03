package com.plataforma.cursos.service;

import com.plataforma.cursos.exception.ResourceNotFoundException;
import com.plataforma.cursos.model.Course;
import com.plataforma.cursos.model.CourseModule;
import com.plataforma.cursos.model.Lesson;
import com.plataforma.cursos.model.Material;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class CatalogService {

    private static final Logger log = LoggerFactory.getLogger(CatalogService.class);
    private static final Pattern FOLDER_PREFIX = Pattern.compile("^[A-Za-z]?\\d+\\s*-\\s*");

    private final FilesystemIndexer filesystemIndexer;
    private final ManifestLoader manifestLoader;

    private volatile List<Course> courses = List.of();
    private volatile Map<String, Course> coursesBySlug = Map.of();
    private volatile Map<String, Path> videoPaths = Map.of();
    private volatile Map<String, Path> materialPaths = Map.of();

    public CatalogService(FilesystemIndexer filesystemIndexer, ManifestLoader manifestLoader) {
        this.filesystemIndexer = filesystemIndexer;
        this.manifestLoader = manifestLoader;
    }

    @PostConstruct
    public void init() {
        reindex();
    }

    public synchronized int reindex() {
        Manifest manifest = manifestLoader.load();
        List<FilesystemIndexer.CourseFolder> folders = filesystemIndexer.scan();

        Map<String, Path> videoIndex = new HashMap<>();
        Map<String, Path> materialIndex = new HashMap<>();
        List<Course> built = folders.stream()
                .map(f -> buildCourse(f, manifest, videoIndex, materialIndex))
                .toList();

        this.courses = built;
        this.coursesBySlug = built.stream().collect(java.util.stream.Collectors.toMap(Course::slug, c -> c));
        this.videoPaths = videoIndex;
        this.materialPaths = materialIndex;
        log.info("Catalog reindexed: {} course(s)", built.size());
        return built.size();
    }

    public List<Course> listCourses() {
        return courses;
    }

    public Course getCourse(String courseSlug) {
        Course course = coursesBySlug.get(courseSlug);
        if (course == null) {
            throw new ResourceNotFoundException("Curso não encontrado: " + courseSlug);
        }
        return course;
    }

    /** modulePath é a cadeia de slugs desde o topo do curso até o módulo desejado (>= 1 elemento). */
    public CourseModule getModule(String courseSlug, List<String> modulePath) {
        List<CourseModule> level = getCourse(courseSlug).modules();
        CourseModule current = null;
        for (String slug : modulePath) {
            current = level.stream()
                    .filter(m -> m.slug().equals(slug))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Módulo não encontrado: " + slug));
            level = current.children();
        }
        if (current == null) {
            throw new ResourceNotFoundException("Módulo não encontrado");
        }
        return current;
    }

    public Optional<Path> resolveVideoPath(String courseSlug, List<String> modulePath, String lessonSlug) {
        return Optional.ofNullable(videoPaths.get(mediaKey(courseSlug, modulePath, lessonSlug)));
    }

    public Optional<Path> resolveMaterialPath(String courseSlug, List<String> modulePath, String materialSlug) {
        return Optional.ofNullable(materialPaths.get(mediaKey(courseSlug, modulePath, materialSlug)));
    }

    private static String mediaKey(String courseSlug, List<String> modulePath, String itemSlug) {
        StringBuilder sb = new StringBuilder(courseSlug);
        for (String slug : modulePath) {
            sb.append('/').append(slug);
        }
        sb.append('/').append(itemSlug);
        return sb.toString();
    }

    private Course buildCourse(FilesystemIndexer.CourseFolder folder, Manifest manifest,
                                Map<String, Path> videoIndex, Map<String, Path> materialIndex) {
        ManifestCourseEntry entry = manifest.courses().get(folder.folderName());
        String title = (entry != null && entry.title() != null) ? entry.title() : humanize(folder.folderName());
        String description = entry != null ? entry.description() : null;
        String coverImage = entry != null ? entry.coverImage() : null;
        Map<String, ManifestModuleEntry> moduleEntries = entry != null ? entry.modules() : Map.of();

        List<CourseModule> modules = folder.moduleFolders().stream()
                .map(moduleFolder -> buildModule(folder.slug(), new ArrayList<>(), moduleFolder, moduleEntries, videoIndex, materialIndex))
                .toList();
        boolean hasContent = modules.stream().anyMatch(CourseModule::hasContent);

        return new Course(folder.slug(), title, description, coverImage, modules, hasContent);
    }

    private CourseModule buildModule(String courseSlug, List<String> ancestorSlugs, FilesystemIndexer.ModuleFolder folder,
                                      Map<String, ManifestModuleEntry> moduleEntries,
                                      Map<String, Path> videoIndex, Map<String, Path> materialIndex) {
        ManifestModuleEntry entry = moduleEntries.get(folder.folderName());
        String title = (entry != null && entry.title() != null) ? entry.title() : humanize(folder.folderName());
        String description = entry != null ? entry.description() : null;
        Map<String, ManifestModuleEntry> childEntries = entry != null ? entry.modules() : Map.of();

        List<String> currentPath = new ArrayList<>(ancestorSlugs);
        currentPath.add(folder.slug());

        if (!folder.children().isEmpty()) {
            List<CourseModule> children = folder.children().stream()
                    .map(child -> buildModule(courseSlug, currentPath, child, childEntries, videoIndex, materialIndex))
                    .toList();
            boolean hasContent = children.stream().anyMatch(CourseModule::hasContent);
            return new CourseModule(folder.slug(), title, description, List.of(), List.of(), children, hasContent);
        }

        Path videosDir = folder.moduleDir().resolve("videos");
        for (Lesson lesson : folder.lessons()) {
            videoIndex.put(mediaKey(courseSlug, currentPath, lesson.slug()), videosDir.resolve(lesson.filename()));
        }
        Path archivesDir = folder.moduleDir().resolve("archives");
        for (Material material : folder.materials()) {
            if (material.isLink()) {
                continue; // materiais do tipo LINK apontam para fora, não têm arquivo local
            }
            materialIndex.put(mediaKey(courseSlug, currentPath, material.slug()), archivesDir.resolve(material.filename()));
        }

        boolean hasContent = !folder.lessons().isEmpty();
        return new CourseModule(folder.slug(), title, description, folder.lessons(), folder.materials(), List.of(), hasContent);
    }

    private static String humanize(String folderName) {
        String stripped = FOLDER_PREFIX.matcher(folderName).replaceFirst("");
        return stripped.isBlank() ? folderName : stripped.trim();
    }
}

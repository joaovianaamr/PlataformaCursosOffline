package com.plataforma.cursos.service;

import com.plataforma.cursos.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class VideoStreamingService {

    private final CatalogService catalogService;
    private final String videosPath;

    public VideoStreamingService(CatalogService catalogService, @Value("${videos.path}") String videosPath) {
        this.catalogService = catalogService;
        this.videosPath = videosPath;
    }

    public Path resolveVideo(String courseSlug, List<String> modulePath, String lessonSlug) {
        Path path = catalogService.resolveVideoPath(courseSlug, modulePath, lessonSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada"));
        return guardWithinRoot(path);
    }

    public Path resolveMaterial(String courseSlug, List<String> modulePath, String materialSlug) {
        Path path = catalogService.resolveMaterialPath(courseSlug, modulePath, materialSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado"));
        return guardWithinRoot(path);
    }

    private Path guardWithinRoot(Path path) {
        Path root = Paths.get(videosPath).toAbsolutePath().normalize();
        Path resolved = path.toAbsolutePath().normalize();
        if (!resolved.startsWith(root) || !Files.isRegularFile(resolved)) {
            throw new ResourceNotFoundException("Recurso não encontrado");
        }
        return resolved;
    }
}

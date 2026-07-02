package com.plataforma.cursos.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Component
public class ManifestLoader {

    private static final Logger log = LoggerFactory.getLogger(ManifestLoader.class);

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String manifestPath;

    public ManifestLoader(ResourceLoader resourceLoader,
                           @Value("${manifest.path:classpath:manifest.json}") String manifestPath) {
        this.resourceLoader = resourceLoader;
        this.manifestPath = manifestPath;
    }

    public Manifest load() {
        Resource resource = resourceLoader.getResource(manifestPath);
        if (!resource.exists()) {
            log.warn("Manifest file not found at {}, using empty manifest", manifestPath);
            return new Manifest(Map.of());
        }
        try (InputStream in = resource.getInputStream()) {
            Manifest manifest = objectMapper.readValue(in, Manifest.class);
            return manifest != null ? manifest : new Manifest(Map.of());
        } catch (IOException e) {
            log.error("Failed to parse manifest at {}", manifestPath, e);
            return new Manifest(Map.of());
        }
    }
}

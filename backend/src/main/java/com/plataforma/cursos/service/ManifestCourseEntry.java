package com.plataforma.cursos.service;

import java.util.Map;

public record ManifestCourseEntry(
        String title,
        String description,
        String coverImage,
        Map<String, ManifestModuleEntry> modules
) {
    public ManifestCourseEntry {
        if (modules == null) {
            modules = Map.of();
        }
    }
}

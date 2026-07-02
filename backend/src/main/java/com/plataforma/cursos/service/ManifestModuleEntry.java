package com.plataforma.cursos.service;

import java.util.Map;

public record ManifestModuleEntry(String title, String description, Map<String, ManifestModuleEntry> modules) {
    public ManifestModuleEntry {
        if (modules == null) {
            modules = Map.of();
        }
    }
}

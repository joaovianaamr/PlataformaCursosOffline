package com.plataforma.cursos.service;

import java.util.Map;

public record Manifest(Map<String, ManifestCourseEntry> courses) {
    public Manifest {
        if (courses == null) {
            courses = Map.of();
        }
    }
}

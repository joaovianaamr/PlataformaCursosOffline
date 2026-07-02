package com.plataforma.cursos.model;

import java.util.List;

public record CourseModule(
        String slug,
        String title,
        String description,
        List<Lesson> lessons,
        List<Material> materials,
        List<CourseModule> children,
        boolean hasContent
) {
}

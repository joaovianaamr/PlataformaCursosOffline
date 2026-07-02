package com.plataforma.cursos.model;

import java.util.List;

public record Course(
        String slug,
        String title,
        String description,
        String coverImage,
        List<CourseModule> modules,
        boolean hasContent
) {
}

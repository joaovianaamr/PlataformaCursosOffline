package com.plataforma.cursos.dto;

public record LessonDto(
        String slug,
        int order,
        String title,
        String videoUrl
) {
}

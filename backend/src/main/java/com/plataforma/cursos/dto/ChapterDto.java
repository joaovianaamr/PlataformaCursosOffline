package com.plataforma.cursos.dto;

public record ChapterDto(
        String slug,
        int order,
        String title,
        double startSeconds,
        double endSeconds
) {
}

package com.plataforma.cursos.dto;

public record CourseSummaryDto(
        String slug,
        String title,
        String description,
        String coverImage,
        int moduleCount,
        boolean hasContent
) {
}

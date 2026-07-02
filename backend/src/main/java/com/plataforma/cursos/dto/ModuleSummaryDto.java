package com.plataforma.cursos.dto;

public record ModuleSummaryDto(
        String slug,
        String title,
        String description,
        int lessonCount,
        boolean hasChildren,
        boolean hasContent
) {
}

package com.plataforma.cursos.dto;

import java.util.List;

public record CourseDetailDto(
        String slug,
        String title,
        String description,
        String coverImage,
        List<ModuleSummaryDto> modules
) {
}

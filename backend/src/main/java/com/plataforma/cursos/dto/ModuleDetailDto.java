package com.plataforma.cursos.dto;

import java.util.List;

public record ModuleDetailDto(
        String slug,
        String title,
        String description,
        List<LessonDto> lessons,
        List<MaterialDto> materials,
        List<ModuleSummaryDto> children
) {
}

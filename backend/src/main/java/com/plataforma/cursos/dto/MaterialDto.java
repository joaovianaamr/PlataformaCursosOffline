package com.plataforma.cursos.dto;

import com.plataforma.cursos.model.MaterialType;

public record MaterialDto(
        String slug,
        String title,
        MaterialType type,
        String fileUrl,
        String url
) {
}

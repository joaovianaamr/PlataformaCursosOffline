package com.plataforma.cursos.dto;

import java.util.List;

public record LessonDto(
        String slug,
        int order,
        String title,
        String videoUrl,
        List<ChapterDto> chapters
) {
}

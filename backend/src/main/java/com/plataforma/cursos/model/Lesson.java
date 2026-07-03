package com.plataforma.cursos.model;

import java.util.List;

public record Lesson(String slug, int order, String title, String filename, List<Chapter> chapters) {
    public Lesson {
        if (chapters == null) {
            chapters = List.of();
        }
    }
}

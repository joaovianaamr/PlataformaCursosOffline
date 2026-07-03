package com.plataforma.cursos.model;

/**
 * Material de apoio de uma aula. Dois formatos:
 * - Arquivo local (PDF em archives/): {@code filename} preenchido, {@code url} nulo.
 * - Link externo (site citado na aula): {@code url} preenchido, {@code filename} nulo,
 *   {@code type == MaterialType.LINK}.
 */
public record Material(String slug, String title, String filename, MaterialType type, String url) {
    public boolean isLink() {
        return url != null && !url.isBlank();
    }
}

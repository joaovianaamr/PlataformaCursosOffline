package com.plataforma.cursos.model;

/**
 * Um capítulo (sub-aula) dentro de um vídeo. Tempos em segundos, extraídos
 * do array `chapters` do YouTube via yt-dlp. É "virtual": o arquivo de vídeo
 * permanece inteiro e o player navega/para nos limites do capítulo.
 */
public record Chapter(String slug, int order, String title, double startSeconds, double endSeconds) {
}

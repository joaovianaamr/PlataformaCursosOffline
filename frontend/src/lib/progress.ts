/**
 * Chave composta para progresso por capítulo, reaproveitando o storage por-lessonSlug do useProgress.
 * Usa chapter.order (não chapter.slug): o slug vem do título do capítulo no YouTube e pode se repetir
 * dentro do mesmo vídeo (ex: "Sugestões" aparecendo duas vezes), enquanto order é sempre único por aula.
 */
export function chapterProgressKey(lessonSlug: string, chapterOrder: number): string {
  return `${lessonSlug}#${chapterOrder}`
}

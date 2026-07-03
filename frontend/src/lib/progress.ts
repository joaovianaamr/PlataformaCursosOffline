/** Chave composta para progresso por capítulo, reaproveitando o storage por-lessonSlug do useProgress. */
export function chapterProgressKey(lessonSlug: string, chapterSlug: string): string {
  return `${lessonSlug}#${chapterSlug}`
}

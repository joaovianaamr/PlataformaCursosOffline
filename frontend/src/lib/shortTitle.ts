/**
 * Extrai o "primeiro pedaço" de um título bruto do YouTube. Os vídeos seguem o
 * padrão "TÓPICO： detalhes ｜ Aula NN (Química X)" (delimitadores full-width);
 * cerca de 1/3 não tem "：", então caem no fallback por vírgula/truncamento.
 */
export function extractShortTitle(title: string): string {
  const beforePipe = title.split(/[｜|]/)[0].trim()
  const beforeColon = beforePipe.split(/[：:]/)[0].trim()
  if (beforeColon.length <= 60) return beforeColon

  const firstClause = beforeColon.split(',')[0].trim()
  if (firstClause.length <= 60) return firstClause

  return firstClause.slice(0, 57).trimEnd() + '…'
}

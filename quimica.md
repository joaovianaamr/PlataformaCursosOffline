# Química Geral e Inorgânica | Química I
https://www.youtube.com/playlist?list=PL0LfmDSptaT3O8cOnzySgo_wpwKmqklj9

# Físico - Química | Química II
https://www.youtube.com/playlist?list=PL0LfmDSptaT0SQtd6HrTGtZlVumtsUNr4 


# Química Orgânica | Química III
https://www.youtube.com/playlist?list=PL0LfmDSptaT3wMA5J2shyQoTY2EofrFgI

---

## Observações sobre o download das playlists (03/07/2026)

Download feito via `download_quimica.sh` (script em
`/tmp/claude-1000/.../scratchpad/download_quimica.sh`), que roda o
`yt-dlp` sequencialmente para as 3 playlists acima, com:

```
yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
  --merge-output-format mp4 --no-overwrites --ignore-errors --no-progress \
  -o "%(playlist_index)02d - %(title)s.%(ext)s" -P "<pasta do módulo>/videos" <url>
```

### O que deu errado

Entre 21:39 e 22:14 (02/07) houve uma instabilidade de rede ao falar com
o CDN do YouTube (`googlevideo.com`): erros repetidos de
`Read timed out` e `Connection aborted / RemoteDisconnected`. O yt-dlp
tentou de novo até 10x por fragmento e, ao esgotar as tentativas, deu
`ERROR: ... Giving up after 10 retries`.

Como o script roda com `--ignore-errors`, ele não para nem tenta a aula
inteira de novo — só abandona aquele item (deixando fragmentos soltos
tipo `.f140.m4a.part`, `.f399.mp4.part`, `.f137.mp4.part` em vez de um
`.mp4` final) e segue pra próxima aula da playlist.

**Aulas afetadas (perdidas) em "01 - Química Geral e Inorgânica":**
- Aula 05 — INTRODUÇÃO à RADIOATIVIDADE (vídeo `.f399.mp4` baixado, áudio `.f140.m4a.part` incompleto — falta mesclar)
- Aula 06 — RADIOATIVIDADE: Cálculo da MEIA-VIDA (só um fragmento de 15KB, praticamente não baixou)
- Aula 07 — INTRODUÇÃO à TABELA PERIÓDICA (só áudio parcial, sem vídeo)
- Aula 08 — TABELA PERIÓDICA: Divisões... (áudio completo, vídeo `.f399.mp4.part` incompleto)

As demais 41 aulas do módulo 1 (01–04, 09–44) baixaram e mesclaram sem
problema. O aviso `WARNING: No supported JavaScript runtime could be
found` que aparece em todo item é só um aviso de depreciação do yt-dlp
(recomenda instalar `deno` ou outro runtime JS) e não foi a causa das
falhas.

### Status em 03/07 (00:19h)

- **Módulo 1 (Química Geral):** concluído, com as 4 aulas acima faltando.
- **Módulo 2 (Físico-Química):** em andamento (script ainda rodando),
  baixando limpo desde então.
- **Módulo 3 (Química Orgânica):** ainda não começou — o script processa
  as playlists em sequência, então a pasta `videos/` dele ficou vazia
  só porque ainda não chegou a vez dele, não por causa de erro.

### Próximo passo (pendente)

Depois que o script terminar as 3 playlists, rebaixar especificamente as
aulas 05–08 de "Química Geral e Inorgânica" (apagar os fragmentos
`.part`/`.f1xx` antes, já que `--no-overwrites` vai ignorar o item se
achar arquivo com o mesmo nome) e rodar
`POST /api/v1/admin/reindex` no backend para o catálogo pegar o
conteúdo novo.


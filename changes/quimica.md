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

### Status final (03/07 12:51h) — concluído

- **Módulo 1 (Química Geral):** as aulas 05–08 foram rebaixadas (fragmentos
  `.part`/`.f1xx` apagados antes) — módulo completo com 44/44 aulas.
- **Módulo 2 (Físico-Química):** confirmado completo, 36/36 aulas, sem
  fragmentos soltos.
- **Módulo 3 (Química Orgânica):** confirmado completo, 18/18 aulas (a
  playlist tem só 18 itens — não faltava nada, só ainda não tinha
  chegado a vez dele quando a nota anterior foi escrita).

Rodado `POST /api/v1/admin/reindex` no backend
(`http://localhost:8734/api/v1/admin/reindex`, sem auth por enquanto —
ver TODO em `SecurityConfig`). Catálogo confirmado via
`GET /api/v1/courses/quimica`: `lessonCount` 44/36/18 nos 3 módulos,
batendo com os totais reais das playlists.


### Módulo 4 — Química IV extraída (03/07 13:xx) — concluído

O usuário notou que, mesmo tendo passado só 3 playlists, apareceram vídeos
marcados "(Química IV)" misturados dentro dos módulos 1 e 2 — 16 aulas de
Estequiometria (Aula 01–16) que a Química I e a Química II compartilhavam
com uma quarta frente. Ação tomada:

- Criado o módulo `04 - Química IV` (com `videos/` e `archives/`).
- Movidas as 16 aulas (12 que estavam no módulo 1, índices 32–43; e 4 que
  estavam no módulo 2, índices 05, 11, 12, 16), renumeradas 01–16 seguindo
  a tag "Aula NN (Química IV)" embutida no título (ordem real da frente).
- Movido também o material da aula 04 (Exercícios/Gabarito/Material em PDF)
  que estava em `01 - Química Geral e Inorgânica/archives/37 - *.pdf`.
- Módulos 1 e 2 renumerados para ficarem contínuos (01–32 cada um),
  incluindo os PDFs em `archives/` que usam o mesmo prefixo numérico do
  vídeo correspondente.
- Rodado `POST /api/v1/admin/reindex`. Catálogo confirmado via API:
  módulo 1 = 32 aulas, módulo 2 = 32 aulas, módulo 3 = 18 aulas (inalterado),
  módulo 4 (Química IV) = 16 aulas. Materiais em PDF (numéricos) e os links
  extraídos da descrição do vídeo (tipo `LINK`, ex. Google Drive) seguiram
  corretamente as aulas movidas/renumeradas, sem quebrar nenhum link.

Observação à parte (não mexida): o módulo 2 tem 2 vídeos duplicados no final
(antigos índices 34/35, agora 30/31) que são cópias literais das aulas 05 e
06 do módulo 1 ("INTRODUÇÃO à RADIOATIVIDADE" e "RADIOATIVIDADE: Cálculo da
MEIA-VIDA"), além de uma cópia duplicada da aula complementar "NOTAÇÃO
CIENTÍFICA" (índice 32 no módulo 1 e 32 no módulo 2). Aparentam ter vindo
originalmente da playlist do YouTube já duplicadas — não foi pedido para
mexer nisso, então ficou como está.

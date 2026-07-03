# Plano — Sub-aulas (capítulos) e materiais extras para os cursos de Química

## Contexto

As aulas de Química (canal "Marcelão da Química") são vídeos longos (1h–1h30) e cada
um contém **vários tópicos independentes**, marcados por timestamp na descrição do
YouTube. Além disso, cada vídeo traz **materiais extras**: PDFs no Google Drive
(exercícios, gabarito) e links de sites citados na aula. Hoje o app trata cada vídeo
como **uma única aula monolítica**, sem navegação interna nem materiais além dos PDFs
que já estejam soltos em `archives/`.

Objetivo: dentro de cada aula, expor os tópicos como **capítulos navegáveis**
(início → fim → título) e anexar os materiais extras (PDFs baixados + links externos),
melhorando muito a navegação sem reprocessar os vídeos.

### Decisões travadas (confirmadas com o usuário)
1. **Capítulos virtuais** — mantém o arquivo de vídeo intacto; capítulos ficam em
   metadados (sidecar JSON); o player navega e para em cada capítulo. Sem ffmpeg, sem
   disco extra, cortes exatos.
2. **PDFs + links de referência** — baixar os PDFs do Drive E anexar os links de sites
   como materiais clicáveis (novo tipo `LINK`). Ignorar promo (Instagram, "Seja Membro",
   DoE2026, link da playlist, outros vídeos do canal).
3. **Escopo: só Química** (os 3 módulos: Química Geral, Físico-Química, Química Orgânica).
   Física (Universo Narrado) fica para depois — formato de descrição é diferente.

### Fatos técnicos já verificados (probes read-only nesta sessão)
- `yt-dlp -J --skip-download` devolve um array **`chapters`** estruturado
  (`start_time`, `end_time`, `title`) — para a Aula 01 vieram exatamente os 6 tópicos.
  **Não precisamos parsear texto de timestamp**; o fim de cada capítulo já vem calculado.
- A `description` traz os links; os do Drive são `drive.google.com/file/d/<id>/view`
  (retornam 200) e os de referência `goo.gl/*` **ainda resolvem** via 302
  (ex.: `goo.gl/wofw1A` → artigo mundoeducacao; `goo.gl/oX6RAa` → globoplay).
- `gdown` **não** está instalado, mas há `pip 24.0` (instalar `gdown --user` ou venv;
  atenção a PEP 668/externally-managed). Alternativa: download via `curl` com confirm-token.
- `ffmpeg` e `yt-dlp 2026.06.09` disponíveis (não usaremos ffmpeg nesta abordagem).

---

## Arquitetura

O design filesystem-as-source-of-truth é preservado. Para cada vídeo
`videos/NN - Título.mp4` passa a existir um sidecar normalizado
`videos/NN - Título.meta.json` com capítulos + materiais. O `FilesystemIndexer` lê o
sidecar quando presente (retrocompatível: sem sidecar = aula sem capítulos, como hoje).

Fonte → curadoria → consumo:
1. **Fetch** (script): `yt-dlp -J` por vídeo → `.info.json` bruto (chapters + description).
2. **Curadoria** (script): normaliza capítulos, classifica/baixa materiais →
   escreve `.meta.json` + baixa PDFs para `archives/`.
3. **Consumo** (backend): indexer lê `.meta.json`; DTOs levam capítulos e materiais
   (locais + links) ao frontend, que renderiza a navegação por capítulos.

---

## Parte 1 — Pipeline de processamento (novo; maior parte do trabalho)

Script Python novo, versionado em `backend/scripts/` (ex.:
`backend/scripts/process_chapters.py`) — Python por causa de JSON + heurística de texto.
Idempotente e resumível por arquivo (pula se `.meta.json` já existe e está completo).

Para cada módulo de Química, para cada `videos/NN - *.mp4`:
1. **Casar vídeo ↔ metadado**: baixar a metadata da playlist com
   `yt-dlp -J --flat-playlist` (índices) e depois `yt-dlp -J --skip-download <url>` por
   item; casar por `playlist_index` == `NN` do nome do arquivo. As URLs das 3 playlists
   estão em `quimica.md`.
2. **Capítulos**: mapear `chapters[]` → lista normalizada
   `{ order, title (limpo/encurtado), startSeconds, endSeconds, slug }`.
   - Título do capítulo: usar o texto do capítulo; encurtar o "miolo entre parênteses"
     para caber (ex.: "Unidades de Massa e Volume"). Manter título longo como tooltip
     opcional (fora do escopo mínimo).
   - `slug` via mesma lógica de `SlugUtils.slugify`.
   - Se o vídeo **não tem** `chapters`, gravar `chapters: []` (aula fica monolítica).
3. **Materiais** — parsear `description`:
   - **Drive PDFs**: regex `drive.google.com/file/d/<id>`. Rótulo pelo texto da linha
     ("exercícios" → EXERCICIOS, "gabarito" → EXERCICIOS/《Gabarito》, "apostila"/"livro"
     → TEORIA). Baixar com `gdown` para `archives/NN - <Rótulo>.pdf`. Registrar material
     local `{ type, filename, url:null }`.
   - **Links de referência**: apenas os sob a seção "Link com os Sites que mencionei na
     aula" (e similares). Resolver redirect (`curl -I -L` ou requests) para URL final;
     título = texto que precede o link na descrição (fallback: `<title>` da página ou o
     host). Registrar material `{ type: LINK, filename:null, url }`.
   - **Denylist (ignorar)**: `instagram.com`, `bit.ly/DoE`, link "SEJA MEMBRO",
     `goo.gl/iph9YB` (playlist), `youtube.com/watch` (outros vídeos), pix/email.
     Implementar como lista de padrões de domínio/keyword.
4. **Escrever** `videos/NN - *.meta.json`:
   ```json
   {
     "sourceVideoId": "XCZyx2IHdxA",
     "chapters": [{ "order":1, "title":"Unidades de Massa e Volume",
                    "slug":"unidades-de-massa-e-volume", "startSeconds":0, "endSeconds":1360 }],
     "materials": [{ "type":"EXERCICIOS", "title":"Exercícios",
                     "slug":"exercicios", "filename":"01 - Exercícios.pdf", "url":null },
                   { "type":"LINK", "title":"A história do Eureka",
                     "slug":"a-historia-do-eureka", "filename":null,
                     "url":"http://mundoeducacao.bol.uol.com.br/..." }]
   }
   ```

**Pré-requisito operacional**: só processar um módulo depois que seus vídeos terminarem
de baixar. Hoje (03/07) o módulo 2 ainda baixa e o 3 não começou; o módulo 1 tem as
aulas 05–08 quebradas (ver `quimica.md`) — rebaixá-las antes de processar.

---

## Parte 2 — Backend (Java / Spring)

Mudanças pequenas e retrocompatíveis. Arquivos:

- **Novo** `model/Chapter.java`:
  `record Chapter(String slug, int order, String title, double startSeconds, double endSeconds)`.
- `model/Lesson.java` — adicionar `List<Chapter> chapters` (vazio quando não há sidecar).
- `model/Material.java` — adicionar `String url` (local: `url=null`; link: `filename=null`).
- `model/MaterialType.java` — adicionar valor `LINK`.
- `service/FilesystemIndexer.java` — em `scanModuleNode`, para cada vídeo procurar
  `<mesmo-nome>.meta.json`; se existir, popular `chapters` da lesson e **mesclar**
  materiais do sidecar (locais + links) com os PDFs já achados em `archives/`
  (dedupe por slug; sidecar tem prioridade nos títulos/rótulos). Reusar `SlugUtils`.
  Materiais LINK não têm arquivo — não entram no índice de caminhos.
- `service/CatalogService.java` — propagar `chapters` ao construir `CourseModule`;
  ao indexar materiais, **não** registrar caminho para materiais `LINK` (só locais vão
  para `materialPaths`). `buildModule` passa a repassar chapters/url.
- DTOs:
  - **Novo** `dto/ChapterDto.java` (slug, order, title, startSeconds, endSeconds).
  - `dto/LessonDto.java` — adicionar `List<ChapterDto> chapters`.
  - `dto/MaterialDto.java` — adicionar `String url` (para LINK, `fileUrl=null` e `url`=externo;
    para local, mantém `fileUrl` apontando ao endpoint e `url=null`).
- `controller/ModuleController.java` — `toLessonDto` inclui capítulos; `toMaterialDto`
  ramifica: material local → `fileUrl` = `/api/v1/media/materials/...` (como hoje);
  material LINK → `url` = URL externa, `fileUrl=null`.
- `MediaController`/`VideoStreamingService` — **sem mudança** (streaming por range já
  suporta o seek dos capítulos; materiais LINK não passam pelo backend).

Reindex via endpoint já existente `POST /api/v1/admin/reindex`.

---

## Parte 3 — Frontend (React / TS)

- `types/course.ts` — adicionar `interface Chapter { slug; order; title; startSeconds;
  endSeconds }`; `Lesson.chapters: Chapter[]`; `Material.url: string | null` e
  `type` passa a incluir `'LINK'`.
- `components/lesson/VideoPlayer.tsx` — aceitar `chapters` e `activeChapterSlug`:
  ao selecionar capítulo, `video.currentTime = start`; no `timeupdate`, ao passar de
  `end`, marcar capítulo assistido e (config) pausar ou ir ao próximo. Mostrar capítulo
  atual. Reusar o padrão de `onProgress`/`markWatched` existente.
- **Novo** `components/lesson/ChapterList.tsx` — lista de capítulos (timestamp + título),
  destaque do ativo, ✓ de assistido; clique faz seek. Visual alinhado ao restyle atual
  (mono para timestamps, ribbon de ativo — ver `LessonSidebar`).
- `pages/LessonPage.tsx` — quando `lesson.chapters.length > 0`, renderizar `ChapterList`
  (abaixo do player ou na coluna lateral) e conectar seleção ↔ player. Sem capítulos,
  comportamento atual inalterado.
- `hooks/useProgress.ts` — permitir progresso por capítulo usando chave composta
  `${lessonSlug}#${chapterSlug}` (as funções já são keyed por string; só os call sites
  mudam). Aula conta como assistida quando todos os capítulos estiverem.
- `components/lesson/MaterialsList.tsx` — se `material.url` (LINK): `<a href={url}
  target="_blank" rel="noreferrer">` com ícone de link; senão, PDF local via
  `buildMaterialUrl(fileUrl)` como hoje.

---

## Sequência de execução

1. (Pré) Terminar downloads dos 3 módulos; rebaixar aulas 05–08 do módulo 1.
2. Instalar `gdown` (`pip install --user gdown`; se PEP 668 bloquear, venv em `backend/scripts/.venv`).
3. Implementar backend (model → indexer → DTO → controller) e compilar
   (`cd backend && ./mvnw -q compile` ou `mvn`).
4. Implementar frontend (types → player → ChapterList → LessonPage → materials);
   `cd frontend && npx tsc --noEmit && npm run build`.
5. Rodar o script em **1 vídeo piloto** (Aula 01, `XCZyx2IHdxA`) e validar o `.meta.json`.
6. Rodar no restante do módulo 1, depois 2 e 3 (conforme downloads concluídos).
7. `POST /api/v1/admin/reindex` e validar via API + UI.

---

## Riscos / observações
- **PEP 668** pode bloquear `pip install gdown` no Python do sistema → usar venv dedicada.
- **Drive restrito/quota**: alguns PDFs podem exigir confirm-token ou estar limitados;
  o script deve logar falhas e seguir (guardar a URL do Drive como material LINK de
  fallback quando o download falhar).
- **Shorteners mortos**: `goo.gl` foi descontinuado em 2025; os testados ainda redirecionam,
  mas se algum falhar, guardar a URL crua como LINK (sem título resolvido).
- **Heurística por canal**: classificação de materiais é específica do "Marcelão"; por isso
  o escopo é só Química. Física precisará de regras próprias.
- **Precisão de fim de capítulo**: `end_time` vem do YouTube; o auto-stop do player pode
  ter ±1s — aceitável.
- **Títulos longos** de capítulo: encurtar para UI, sem perder o texto completo (tooltip).

---

## Verificação (end-to-end)
- **Script/piloto**: rodar em `XCZyx2IHdxA` → asserir 6 capítulos, 2 PDFs baixados em
  `archives/`, 2 links de referência classificados, promo ignorada.
- **Backend**: `reindex` + `GET /api/v1/courses/quimica/modules/01-quimica-geral-e-inorganica`
  → a aula 01 traz `chapters` (6) e `materials` com um item `type:"LINK"` (url externa) e
  PDFs locais com `fileUrl`.
- **Frontend**: `tsc --noEmit` + `build` limpos; `vite` + Playwright screenshot da
  `LessonPage` mostrando a lista de capítulos, seek ao clicar, e materiais (PDF + link
  externo). Validar contra o backend real (docker-compose em :8734).
- Regressão: uma aula **sem** capítulos (ex.: Física) continua funcionando como hoje.

---

## Nota sobre o arquivo do plano
O usuário pediu o plano em `PlataformaCursosOffline/plan.md`. Em modo de plano só posso
escrever o arquivo de plano designado; após aprovação (e num worktree), copio este
conteúdo para `plan.md` no repositório.

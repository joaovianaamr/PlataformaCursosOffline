# Plano: Player de Vídeo estilo YouTube

## Contexto atual

`frontend/src/components/lesson/VideoPlayer.tsx` usa a tag `<video controls>` nativa do
navegador — sem UI customizada. Controles, aparência e comportamento (play/pause, barra de
progresso, volume, tela cheia) dependem inteiramente do browser/SO do usuário e não têm opção
de velocidade de reprodução exposta na maioria dos navegadores.

Stack disponível: React 18 + TypeScript + Tailwind (via `className`), sem lib de ícones nem
lib de player instalada (`frontend/package.json`). O componente já gerencia progresso
(`onProgress`) e posição inicial (`initialPositionSeconds`), então a lógica de salvar progresso
deve ser preservada.

## Objetivo

Substituir os controles nativos por uma barra de controles customizada, com visual e
comportamento inspirados no YouTube, incluindo controle de velocidade de reprodução.

## Escopo de funcionalidades

1. **Barra de controles customizada** (esconde os controles nativos com `controls={false}`)
   - Botão play/pause (ícone alterna conforme estado)
   - Barra de progresso (seek) clicável e arrastável, com preview do tempo ao passar o mouse
   - Buffer visual (trecho já carregado, via `buffered` do elemento `<video>`)
   - Tempo atual / duração total (`mm:ss`)
   - Botão de volume + slider, com mute toggle
   - Botão de tela cheia (`requestFullscreen` / `exitFullscreen`)
   - Auto-hide dos controles após alguns segundos sem interação (igual YouTube), reaparecendo
     no `mousemove`/toque
   - Overlay central de play/pause ao clicar no vídeo

2. **Controle de velocidade (feature principal solicitada)**
   - Botão de "engrenagem"/velocidade que abre um menu com opções:
     `0.25x, 0.5x, 0.75x, 1x (Normal), 1.25x, 1.5x, 1.75x, 2x`
   - Aplica via `video.playbackRate`
   - Mantém a velocidade escolhida ao trocar de aula (opcional: persistir em
     `localStorage`, já que o projeto é "offline")
   - Indicação visual da velocidade atual selecionada no menu

3. **Atalhos de teclado (paridade com YouTube)**
   - `Espaço` / `K`: play/pause
   - `→` / `←`: avançar/retroceder 5s (ou 10s, decidir)
   - `↑` / `↓`: volume +/-
   - `F`: tela cheia
   - `M`: mute
   - `0-9`: pular para 0%-90% do vídeo

## Plano de implementação

### Etapa 1 — Estrutura base do componente
- Criar `frontend/src/components/lesson/VideoPlayer/` como pasta (substitui o arquivo único)
  - `VideoPlayer.tsx`: componente principal, mantém a mesma interface pública (`videoUrl`,
    `lessonSlug`, `initialPositionSeconds`, `onProgress`, `onEnded`) para não quebrar quem
    consome o componente
  - `Controls.tsx`: barra de controles
  - `useVideoControls.ts`: hook com estado (playing, currentTime, duration, volume, muted,
    playbackRate, fullscreen, buffered) e handlers
  - `formatTime.ts`: helper `mm:ss` / `hh:mm:ss`
- Trocar `controls` nativo por `controls={false}` e renderizar `<Controls />` por cima via
  wrapper `relative`

### Etapa 2 — Ícones
- Sem lib de ícones no projeto; usar SVGs inline simples (play, pause, volume, mute,
  fullscreen, settings/gear) como pequenos componentes em `frontend/src/components/icons/`
  para não adicionar dependência nova

### Etapa 3 — Barra de progresso e buffer
- `<input type="range">` estilizado ou `<div>` custom com `onMouseDown/onMouseMove/onMouseUp`
  para permitir arrastar
- Calcular buffer usando `video.buffered.end(video.buffered.length - 1)`

### Etapa 4 — Menu de velocidade
- Componente `SpeedMenu.tsx` (popover simples, fecha ao clicar fora)
- Estado de velocidade no hook `useVideoControls`, aplicado via `useEffect` em
  `video.playbackRate`
- Persistir última velocidade escolhida em `localStorage` (`videoPlaybackRate`)

### Etapa 5 — Auto-hide de controles e overlay de play
- Timer (`setTimeout`) resetado em `mousemove`/`touchstart`/interação com os controles;
  esconde após ~3s se estiver tocando
- Overlay clicável central com ícone grande de play/pause

### Etapa 6 — Atalhos de teclado
- `onKeyDown` no container do player (precisa de `tabIndex` para foco) ou listener global
  enquanto o player está montado

### Etapa 7 — Integração e regressão
- Garantir que `onProgress`, `onEnded` e `initialPositionSeconds` continuam funcionando
  exatamente como hoje
- Testar em Chrome/Firefox, mobile (touch) e tela cheia
- Testar teclado não conflitar com inputs de texto em outras partes da página

## Fora de escopo (por ora)
- Qualidade de vídeo adaptativa (não há streaming HLS/DASH, é MP4 direto)
- Legendas/CC
- Picture-in-picture custom (pode usar o nativo do browser como bônus simples, baixo custo)
- Miniaturas ao passar o mouse na barra de progresso (feature YouTube avançada, complexa
  sem geração prévia de thumbnails — avaliar depois)

## Arquivos impactados
- `frontend/src/components/lesson/VideoPlayer.tsx` → migra para pasta
  `frontend/src/components/lesson/VideoPlayer/`
- Novos arquivos: `Controls.tsx`, `SpeedMenu.tsx`, `useVideoControls.ts`, `formatTime.ts`,
  ícones SVG
- Nenhuma mudança de contrato esperada para quem importa `VideoPlayer` (mesmas props)

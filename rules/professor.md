Você é um engenheiro de software sênior e também meu PROFESSOR. Eu sei lógica de programação em Python, mas estou migrando para a stack:
- Backend: Java 21 + Spring Boot 3 (Maven)
- Frontend: TypeScript + React (Vite)
- DB: PostgreSQL
- Infra: Docker Compose

Contexto atual:
- Já existe um monorepo com pastas /backend e /frontend, mas por enquanto só as pastas foram criadas.

OBJETIVO
A cada bloco do projeto, você deve:
1) implementar o bloco com qualidade profissional
2) me ensinar o que foi feito (didático, sem pular passos)
3) criar um “diário do bloco” dentro do repositório (arquivo .md)
4) me propor mudanças que EU devo fazer para aprender (exercícios práticos)
5) me dar um checklist para eu testar manualmente
6) criar commits seguindo as regras em `rules/commits.md`

REGRAS DE ENSINO (OBRIGATÓRIAS)
- Antes de codar: explique o bloco em até 12 tópicos com analogias simples (pode comparar com Python quando fizer sentido).
- Depois de codar: faça um tour guiado do código (arquivos principais e função de cada um).
- Me dê 3 exercícios pequenos para eu fazer, com passos e critério de "deu certo".
- Recomende 1 refatoração opcional (para eu tentar depois).
- Sempre inclua comandos para eu rodar e validar (mvn, docker, npm).
- Não faça perguntas; assuma padrões sensatos e documente suas decisões.
- **SEMPRE que citar uma modificação em arquivo, forneça a referência completa do caminho do arquivo** (ex: `backend/src/main/resources/application.yml` ou caminho absoluto quando relevante).

PASTA E DOCUMENTAÇÃO OBRIGATÓRIA
Crie uma pasta na raiz:
  /learning

A cada bloco N, crie um arquivo:
  /learning/BLOCO-N-<nome-curto>.md

Esse arquivo deve conter exatamente estas seções (em markdown):
1) Objetivo do bloco
2) O que eu devo aprender neste bloco (5 itens)
3) Conceitos explicados (explicação simples + exemplo)
4) O que foi implementado (lista)
5) Arquivos importantes e por quê
6) Como rodar e testar (comandos)
7) Erros comuns e como diagnosticar
8) Exercícios para eu fazer (3 exercícios)
9) Refatoração opcional (1 sugestão)
10) Checklist de validação (passo a passo)

DOCUMENTO DE COMO EU DEVO ESTUDAR USANDO VOCÊ (OBRIGATÓRIO)
Crie também na raiz:
  /learning/COMO-ESTUDAR-COM-O-AGENTE.md

Conteúdo desse documento (seções):
1) Como usar o projeto para aprender (rotina diária de 60–90 min)
2) Método “ver -> rodar -> mudar -> quebrar -> consertar”
3) Como revisar cada bloco (checklist do revisor)
4) Como fazer perguntas úteis (exemplos)
5) Como registrar aprendizado (template rápido)
6) Como evoluir do MVP para features avançadas (trilha)
7) Como comparar com Python (ponte mental Python -> Java/TS)
8) Regras de ouro para não virar “copiador de código”

REGRAS DE COMMITS
- Siga rigorosamente as regras definidas em `rules/commits.md` (Conventional Commits, granularidade, fluxo de trabalho).
- Após cada commit, escreva:
  - mensagem do commit
  - o que mudou (3 bullets)
  - como eu testo

CHECKPOINTS
- No final de cada bloco, você deve listar:
  - “O que você (João) deve conseguir explicar agora”
  - “O que revisar se travar”
  - “Próximo bloco sugerido”

FORMA DE ENTREGA
Para este bloco atual (Bloco 1), faça:
A) criar a pasta /learning e os dois documentos (BLOCO-1 + COMO-ESTUDAR...)
B) bootstrap do backend Spring Boot (Maven) e do frontend Vite React TS
C) docker-compose com PostgreSQL
D) README na raiz com passos para rodar

BLOCO 1 (AGORA): Inicialização Profissional
Entregáveis mínimos:
- /backend: app Spring Boot rodando em /actuator/health e /api/v1/ping
- /frontend: app React rodando e exibindo “Plataforma de Cursos”
- docker-compose.yml: postgres + variáveis básicas
- docs e learning/ completos

IMPORTANTE
- Mostre a árvore de arquivos criada/alterada
- Forneça todo o código necessário
- Não deixe "TODO" crítico sem resolver
- Se algo for opcional, marque como opcional
- **Ao mencionar qualquer modificação em arquivo, sempre inclua o caminho completo do arquivo** (ex: ao dizer "modifique o application.yml", escreva "modifique o arquivo `backend/src/main/resources/application.yml`")

esses arquivos não devem ser commitados no projeto
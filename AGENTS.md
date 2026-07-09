# AGENTS.md

## Visao geral
- Monorepo com backend (Spring Boot 3 / Java 21) e frontend (React + TS / Vite).
- Infra via Docker Compose com PostgreSQL.
- Documentacao de aprendizado em /learning.

## Estrutura principal
- /backend: aplicacao Spring Boot.
- /frontend: aplicacao React + Vite.
- /learning: docs do bloco e guia de estudo.
- /docker-compose.yml, /.env.example, /README.md.

## Configuracao local
- Copie .env.example para .env e ajuste as variaveis.
- Nao commitar segredos ou arquivos locais.

## Comandos rapidos
### Docker (recomendado)
- docker-compose up -d
- docker-compose logs -f backend
- docker-compose down

### Backend
- cd backend
- mvn spring-boot:run
- mvn test

### Frontend
- cd frontend
- npm install
- npm run dev
- npm run build
- npm run lint (se existir)

## Endpoints uteis
- http://localhost:8080/actuator/health
- http://localhost:8080/api/v1/ping
- Frontend: http://localhost:3000 (docker) ou 5173 (dev)

## Convencoes e fluxo
- Use Conventional Commits: <type>(<scope>): <summary>
- Nao misturar backend e frontend no mesmo commit, salvo ajuste minimo.
- Antes de commitar, rode testes e lint quando existirem.
- Evite comentarios desnecessarios; prefira nomes claros.
- Responda em portugues nas interacoes do agente.

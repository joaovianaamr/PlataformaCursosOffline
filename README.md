# Plataforma de Cursos Offline

Plataforma privada de cursos com vídeos locais, desenvolvida com Spring Boot 3 (Java 21) no backend e React + TypeScript (Vite) no frontend.

## Estrutura do Projeto

```
/
├── docker-compose.yml          # Orquestração dos serviços
├── .env.example               # Variáveis de ambiente de exemplo
├── README.md                  # Este arquivo
├── learning/                  # Documentação de aprendizado
│   ├── BLOCO-1-inicializacao-profissional.md
│   └── COMO-ESTUDAR-COM-O-AGENTE.md
├── backend/                   # Aplicação Spring Boot
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/com/plataforma/cursos/
│           │   ├── PlataformaCursosApplication.java
│           │   ├── config/
│           │   │   └── SecurityConfig.java
│           │   ├── controller/
│           │   │   ├── InfoController.java
│           │   │   └── PingController.java
│           │   ├── service/          # Lógica de negócio
│           │   ├── repository/       # Interfaces JPA Repository
│           │   ├── model/            # Entidades JPA
│           │   ├── dto/              # Data Transfer Objects
│           │   └── exception/        # Tratamento de exceções
│           └── resources/
│               └── application.yml
└── frontend/                  # Aplicação React + Vite
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── main.tsx
        ├── App.tsx
        └── index.css
```

## Pré-requisitos

- Docker e Docker Compose instalados
- Git (opcional, para clonar o repositório)

## Configuração Inicial

1. **Clone o repositório** (se aplicável):
   ```bash
   git clone <url-do-repositorio>
   cd plataformaCursoOffline
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e ajuste as variáveis conforme necessário, especialmente:
   - `JWT_SECRET`: Use uma chave secreta forte (mínimo 256 bits)
   - `VIDEOS_PATH`: Caminho local onde estão os vídeos dos cursos

3. **Estrutura de vídeos esperada**:
   ```
   videos/
     Curso1/
       Modulo1/
         aula1.mp4
         aula2.mp4
       Modulo2/
         aula3.mp4
     Curso2/
       Modulo1/
         aula1.mp4
   ```

## Como Executar

### Via Docker Compose (Recomendado)

1. **Suba todos os serviços**:
   ```bash
   docker-compose up -d
   ```

2. **Verifique os logs**:
   ```bash
   # Todos os serviços
   docker-compose logs -f
   
   # Apenas backend
   docker-compose logs -f backend
   
   # Apenas frontend
   docker-compose logs -f frontend
   ```

3. **Verifique a saúde do backend**:
   ```bash
   curl http://localhost:8080/actuator/health
   ```
   **Resposta esperada:** `{"status":"UP"}`

4. **Teste o endpoint de ping**:
   ```bash
   curl http://localhost:8080/api/v1/ping
   ```
   **Resposta esperada:** `{"status":"ok","message":"pong"}`

5. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Actuator Health: http://localhost:8080/actuator/health
   - Ping Endpoint: http://localhost:8080/api/v1/ping

### Parar os serviços

```bash
docker-compose down
```

Para remover também os volumes (dados do PostgreSQL serão perdidos):
```bash
docker-compose down -v
```

## Desenvolvimento Local

### Backend

1. **Pré-requisitos**:
   - Java 21
   - Maven 3.9+

2. **Execute localmente**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   O backend estará disponível em http://localhost:8080

### Frontend

1. **Pré-requisitos**:
   - Node.js 20+
   - npm ou yarn

2. **Instale as dependências**:
   ```bash
   cd frontend
   npm install
   ```

3. **Execute em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

   O frontend estará disponível em http://localhost:5173

## Variáveis de Ambiente

Consulte o arquivo `.env.example` para ver todas as variáveis disponíveis. As principais são:

- `POSTGRES_*`: Configurações do banco de dados PostgreSQL
- `JWT_SECRET`: Chave secreta para assinatura dos tokens JWT
- `JWT_EXPIRATION`: Tempo de expiração do token em milissegundos
- `VIDEOS_PATH`: Caminho local para a pasta de vídeos
- `CORS_ALLOWED_ORIGINS`: Origens permitidas para CORS

**Nota de Segurança:** O PostgreSQL não expõe a porta 5432 externamente por padrão. O acesso ao banco é feito apenas através da rede Docker interna. Para acessar o PostgreSQL manualmente, use: `docker exec -it plataforma-postgres psql -U plataforma -d plataforma_cursos`

## Aprendizado e Documentação

Este projeto foi estruturado para aprendizado progressivo. Consulte a pasta `/learning` para:

- **BLOCO-1-inicializacao-profissional.md**: Documentação completa do Bloco 1 com explicações, exercícios e checklist
- **COMO-ESTUDAR-COM-O-AGENTE.md**: Guia de como usar este projeto para aprender Java/Spring Boot e React/TypeScript

### Status Atual: Bloco 1 ✅

**O que está funcionando:**
- ✅ Backend Spring Boot rodando com endpoints `/actuator/health` e `/api/v1/ping`
- ✅ Frontend React exibindo interface inicial
- ✅ Docker Compose orquestrando PostgreSQL + Backend + Frontend
- ✅ Documentação completa de aprendizado

## Próximos Passos

**Bloco 2 (Próximo):** Primeira Entidade e CRUD Básico
- Criar entidade `Curso` (id, nome, descrição)
- Criar `CursoRepository` (Spring Data JPA)
- Criar `CursoController` com CRUD completo
- Frontend: listar cursos em uma tabela

**Roadmap Completo:**
1. ✅ Bloco 1: Inicialização Profissional (concluído)
2. Bloco 2: Primeira Entidade e CRUD Básico
3. Bloco 3: Validações e Tratamento de Erros
4. Bloco 4: Autenticação com JWT
5. Bloco 5: Indexação de Vídeos
6. Bloco 6: Player de Vídeo com Streaming
7. Bloco 7: Sistema de Progresso
8. Bloco 8: Busca e Filtros

## Tecnologias

- **Backend**: Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA, PostgreSQL, JWT
- **Frontend**: React 18, TypeScript, Vite, React Router, Axios
- **Infraestrutura**: Docker, Docker Compose, Nginx

## Licença

Este projeto é privado e de uso interno.

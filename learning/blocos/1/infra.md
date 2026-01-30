# Bloco 1: Infraestrutura

## 1. Objetivo do bloco

Configurar a infraestrutura completa da aplicação usando Docker Compose:
- PostgreSQL rodando e acessível apenas via rede Docker interna
- Orquestração de serviços (PostgreSQL → Backend → Frontend)
- Variáveis de ambiente para configuração
- Healthchecks para garantir inicialização correta

**Resultado esperado:** Você consegue subir toda a infraestrutura com `docker-compose up -d` e todos os serviços se conectam corretamente.

## 2. O que eu devo aprender neste bloco (5 itens)

1. **Docker Compose básico**: Como definir e orquestrar múltiplos containers
2. **Networks Docker**: Como serviços se comunicam dentro da mesma rede
3. **Dependências entre serviços**: Como usar `depends_on` para ordem de inicialização
4. **Variáveis de ambiente**: Como configurar serviços via variáveis de ambiente
5. **Healthchecks**: Como garantir que serviços estão prontos antes de iniciar dependências

## 3. Conceitos explicados (explicação simples + exemplo)

### 3.1 Docker Compose - Conexão entre Serviços

**O que é:** Arquivo YAML que define como múltiplos containers se conectam.

**Analogia Python:** É como ter um script que:
1. Sobe PostgreSQL
2. Espera ele ficar pronto
3. Sobe o backend (que conecta no PostgreSQL)
4. Sobe o frontend (que conecta no backend)

**Estrutura:**
```yaml
services:
  postgres:        # Container 1: Banco de dados
    image: postgres:16-alpine
    # Porta não exposta externamente por segurança
    # Acesso apenas via rede Docker interna
  
  backend:         # Container 2: API Java
    depends_on:
      postgres:    # Espera PostgreSQL ficar pronto
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/...
      #                              ↑ nome do serviço no Docker
  
  frontend:        # Container 3: Interface React
    depends_on:
      backend:     # Espera backend ficar pronto
```

**Pontos importantes:**
- `postgres:5432` = nome do serviço é usado como hostname dentro do Docker
- `depends_on` = ordem de inicialização
- `networks` = todos na mesma rede podem se comunicar
- **Segurança:** PostgreSQL não expõe porta 5432 externamente, apenas acessível via rede Docker interna

### 3.2 Networks Docker

**O que é:** Rede virtual que permite containers se comunicarem usando nomes de serviços.

**Analogia Python:** É como ter um DNS interno onde cada serviço tem um nome que resolve para seu IP.

**Como funciona:**
- Todos os serviços na mesma `network` podem se comunicar
- O nome do serviço (ex: `postgres`) funciona como hostname
- Não precisa saber o IP do container, apenas o nome

**Exemplo:**
```yaml
services:
  postgres:
    networks:
      - plataforma-network
  
  backend:
    networks:
      - plataforma-network
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/...
      #                              ↑ nome do serviço = hostname

networks:
  plataforma-network:
    driver: bridge
```

### 3.3 depends_on e Healthchecks

**O que é:** Mecanismo para garantir ordem de inicialização e verificar se serviços estão prontos.

**Analogia Python:** É como esperar um serviço ficar "saudável" antes de iniciar outro que depende dele.

**Como funciona:**
```yaml
services:
  backend:
    depends_on:
      postgres:
        condition: service_healthy  # Espera healthcheck passar
  
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U plataforma"]
      interval: 10s
      timeout: 5s
      retries: 5
```

**O que acontece:**
1. PostgreSQL inicia
2. Healthcheck roda a cada 10s
3. Quando `pg_isready` retorna sucesso, PostgreSQL fica "healthy"
4. Backend só inicia quando PostgreSQL está "healthy"

### 3.4 Variáveis de Ambiente

**O que é:** Forma de configurar serviços sem hardcodar valores no código.

**Analogia Python:** É como usar `os.getenv()` ou arquivo `.env`, mas configurado no Docker Compose.

**Sintaxe:**
```yaml
services:
  backend:
    environment:
      SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL:jdbc:postgresql://postgres:5432/plataforma_cursos}
      #                              ↑ variável de ambiente  ↑ valor padrão se não existir
```

**Fontes de variáveis:**
1. Arquivo `.env` na raiz do projeto
2. Variáveis do sistema (exportadas no shell)
3. Valores padrão no `docker-compose.yml` (após `:`)

### 3.5 Volumes Docker

**O que é:** Persistência de dados entre reinicializações de containers.

**Analogia Python:** É como salvar dados em um arquivo que não é apagado quando o programa fecha.

**Exemplo:**
```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # ↑ volume nomeado (persiste dados)

volumes:
  postgres_data:  # Volume criado automaticamente
```

**Tipos de volumes:**
- **Volume nomeado:** `postgres_data:/path` - persiste dados
- **Bind mount:** `./videos:/videos` - mapeia pasta do host

## 4. O que foi implementado (lista)

### Infraestrutura
- [x] `docker-compose.yml` com PostgreSQL, Backend e Frontend
- [x] Network `plataforma-network` para comunicação entre serviços
- [x] Healthchecks configurados para PostgreSQL e Backend
- [x] Variáveis de ambiente para configuração
- [x] Volumes para persistência de dados do PostgreSQL
- [x] Segurança: PostgreSQL não expõe porta 5432 externamente

## 5. Arquivos importantes e por quê

### Infraestrutura

**`docker-compose.yml`**
- **O que faz:** Orquestra PostgreSQL + Backend + Frontend
- **Por que importa:** Um comando sobe tudo integrado
- **Analogia:** É um script que sobe todos os serviços

**`.env` (a ser criado)**
- **O que faz:** Variáveis de ambiente (senhas, URLs, etc)
- **Por que importa:** Configurações sensíveis não vão no código
- **Analogia:** É o `.env` do Python

## 6. Como rodar e testar (comandos)

### Pré-requisitos
- Docker e Docker Compose instalados

### Subir todos os serviços:
```bash
docker-compose up -d
```

### Verificar logs:
```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas postgres
docker-compose logs -f postgres
```

### Verificar status dos containers:
```bash
docker-compose ps
```

**Saída esperada:**
```
NAME                    STATUS          PORTS
plataforma-backend      Up (healthy)    0.0.0.0:8080->8080/tcp
plataforma-frontend     Up              0.0.0.0:3000->80/tcp
plataforma-postgres     Up (healthy)    
```

### Verificar se PostgreSQL está saudável:
```bash
# PostgreSQL não está acessível externamente (porta 5432 não exposta)
# Acesso apenas via docker exec (recomendado para segurança)
docker exec -it plataforma-postgres psql -U plataforma -d plataforma_cursos -c "SELECT version();"
```

### Parar serviços:
```bash
docker-compose down
```

### Parar e remover volumes (cuidado: apaga dados):
```bash
docker-compose down -v
```

### Rebuild após mudanças:
```bash
# Backend
docker-compose up -d --build backend

# Frontend
docker-compose up -d --build frontend

# Tudo
docker-compose up -d --build
```

## 7. Erros comuns e como diagnosticar

### Erro 1: "Cannot connect to database"

**Sintomas:**
```
org.postgresql.util.PSQLException: Connection to localhost:5432 refused
```

**Causas possíveis:**
1. PostgreSQL não iniciou ainda
2. Credenciais erradas
3. Nome do banco errado
4. Tentativa de conexão externa (porta 5432 não está exposta por segurança)

**Nota de Segurança:**
- A porta 5432 do PostgreSQL não está exposta externamente por padrão
- Isso impede conexões não autorizadas de fora do Docker
- Para acessar o PostgreSQL, use: `docker exec -it plataforma-postgres psql -U plataforma -d plataforma_cursos`
- O backend conecta corretamente via rede Docker interna usando o nome do serviço `postgres:5432`

**Como diagnosticar:**
```bash
# Verificar se PostgreSQL está saudável
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Testar conexão manualmente (via docker exec)
docker exec -it plataforma-postgres psql -U plataforma -d plataforma_cursos
```

**Solução:**
- Aguardar PostgreSQL ficar saudável (healthcheck)
- Verificar variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Verificar `SPRING_DATASOURCE_URL` no backend (deve usar `postgres:5432`, não `localhost:5432`)

### Erro 2: "Port already in use"

**Sintomas:**
```
Error: bind: address already in use
```

**Causas possíveis:**
1. Outra aplicação usando a porta
2. Container anterior não foi parado

**Como diagnosticar:**
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

**Solução:**
- Parar processo que usa a porta ou mudar porta no `.env`
- Parar containers: `docker-compose down`
- Verificar containers órfãos: `docker ps -a`

### Erro 3: "Service unhealthy"

**Sintomas:**
```
Container plataforma-postgres is unhealthy
```

**Causas possíveis:**
1. PostgreSQL não conseguiu inicializar
2. Healthcheck falhando
3. Recursos insuficientes (memória, disco)

**Como diagnosticar:**
```bash
# Ver logs detalhados
docker-compose logs postgres

# Verificar recursos
docker stats plataforma-postgres

# Testar healthcheck manualmente
docker exec plataforma-postgres pg_isready -U plataforma
```

**Solução:**
- Verificar logs para erro específico
- Aumentar recursos do Docker (memória, CPU)
- Verificar se porta 5432 não está em uso

## 8. Exercícios para eu fazer (1 exercício)

### Exercício 1: Adicionar variável de ambiente no docker-compose

**Objetivo:** Configurar o nome da aplicação via variável de ambiente.

**Passos:**
1. No `docker-compose.yml`, adicione uma variável `APP_NAME` no serviço `backend`
2. No `application.yml`, use `${APP_NAME:Plataforma de Cursos}` para `spring.application.name`
3. Crie um arquivo `.env` na raiz com `APP_NAME=Minha Plataforma`
4. Reinicie: `docker-compose down && docker-compose up -d`

**Critério de "deu certo":**
- Logs do backend mostram `spring.application.name=Minha Plataforma`
- Endpoint `/actuator/info` (se existir) mostra o nome correto

**Dica:** Use `${VAR:default}` no YAML para valor padrão.

## 9. Refatoração opcional (1 sugestão)

### Organizar variáveis de ambiente em seções

**O que fazer:**
- No `docker-compose.yml`, agrupe variáveis de ambiente por categoria:
  ```yaml
  environment:
    # Database
    SPRING_DATASOURCE_URL: ...
    SPRING_DATASOURCE_USERNAME: ...
    
    # Application
    SERVER_PORT: ...
    APP_NAME: ...
  ```

**Por que fazer:**
- Facilita manutenção
- Código mais legível
- Fica claro quais variáveis são relacionadas

## 10. Checklist de validação (passo a passo)

Use este checklist para garantir que tudo está funcionando:

### ✅ Infraestrutura

- [ ] Docker e Docker Compose instalados e funcionando
- [ ] Comando `docker-compose up -d` executa sem erros
- [ ] Todos os 3 containers estão rodando (`docker-compose ps`)
- [ ] PostgreSQL está saudável (healthcheck passou)
- [ ] Backend está saudável (healthcheck passou)
- [ ] Network `plataforma-network` foi criada (`docker network ls`)

### ✅ Segurança

- [ ] PostgreSQL não está acessível externamente (porta 5432 não exposta)
- [ ] Acesso ao banco apenas via rede Docker interna
- [ ] Backend conecta corretamente via nome do serviço `postgres:5432`

### ✅ Variáveis de Ambiente

- [ ] Variáveis de ambiente estão sendo lidas corretamente
- [ ] Valores padrão funcionam quando `.env` não existe
- [ ] Arquivo `.env` está no `.gitignore` (se contém secrets)

---

## Checkpoint: O que você deve conseguir explicar agora

Após completar este bloco, você deve conseguir explicar:

1. **Como Docker Compose conecta serviços:** `depends_on` + `networks` + variáveis de ambiente
2. **Por que usar networks:** Comunicação segura entre containers usando nomes de serviços
3. **O que são healthchecks:** Verificação automática de saúde dos serviços
4. **Como variáveis de ambiente funcionam:** Configuração sem hardcode, com valores padrão

## O que revisar se travar

Se você travar em algum ponto, revise:

- **Docker não funciona:** Verifique se Docker Desktop está rodando, verifique portas em uso
- **Serviços não se conectam:** Verifique se estão na mesma network, verifique nomes de serviços
- **Healthcheck falha:** Verifique logs do serviço, verifique se o comando de healthcheck está correto

## Próximo bloco sugerido

**Bloco 1 - Backend:** Spring Boot rodando, endpoints básicos, Actuator

# Bloco 1: Inicialização Profissional

## 1. Objetivo do bloco

Criar a base completa de uma aplicação full-stack profissional:
- Backend Spring Boot rodando e respondendo em `/actuator/health` e `/api/v1/ping`
- Frontend React exibindo a interface inicial
- Docker Compose orquestrando PostgreSQL + Backend + Frontend
- Documentação completa para desenvolvimento

**Resultado esperado:** Você consegue rodar toda a aplicação com um comando e ver ambos funcionando.

## 2. O que eu devo aprender neste bloco (5 itens)

1. **Estrutura de um projeto Spring Boot**: Como o Maven organiza o código Java e onde cada coisa fica
2. **Anotações básicas do Spring**: `@SpringBootApplication`, `@RestController`, `@GetMapping` - o que fazem e por quê
3. **Estrutura de um projeto React + Vite**: Como o TypeScript e React se organizam em componentes
4. **Docker Compose básico**: Como conectar serviços (PostgreSQL ↔ Backend ↔ Frontend)
5. **Conventional Commits**: Padrão profissional de mensagens de commit

## 3. Conceitos explicados (explicação simples + exemplo)

### 3.1 Spring Boot Application Class

**O que é:** A classe principal que inicia toda a aplicação Spring Boot.

**Analogia Python:** É como o `if __name__ == '__main__': app.run()` do Flask, mas muito mais poderoso.

**Exemplo:**
```java
@SpringBootApplication
public class PlataformaCursosApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlataformaCursosApplication.class, args);
    }
}
```

**O que acontece:**
- `@SpringBootApplication` = "Ei Spring, configure tudo automaticamente"
- `SpringApplication.run()` = "Inicie o servidor na porta 8080"
- Spring escaneia o projeto procurando por `@RestController`, `@Service`, etc.

**Comparação Python:**
```python
# Python (Flask)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

# Java (Spring Boot) - equivalente automático
@SpringBootApplication  # Faz tudo isso automaticamente
```

### 3.2 @RestController e @GetMapping

**O que é:** Anotações que transformam uma classe Java em um endpoint HTTP.

**Analogia Python:** `@RestController` = `@app.route()` do Flask, `@GetMapping` = `methods=['GET']`.

**Exemplo:**
```java
@RestController
@RequestMapping("/api/v1")
public class PingController {
    
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok", "message", "pong");
    }
}
```

**O que acontece:**
- `@RestController` = "Esta classe responde requisições HTTP"
- `@RequestMapping("/api/v1")` = "Todos os endpoints começam com `/api/v1`"
- `@GetMapping("/ping")` = "Este método responde GET em `/api/v1/ping`"
- O retorno é automaticamente convertido para JSON

**Comparação Python:**
```python
# Python (Flask)
@app.route('/api/v1/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok", "message": "pong"})

# Java (Spring Boot) - mais declarativo
@GetMapping("/ping")  # Já sabe que é GET
public Map<String, String> ping() {  # Já converte para JSON
    return Map.of("status", "ok", "message", "pong");
}
```

### 3.3 Actuator Health Endpoint

**O que é:** Endpoint pré-configurado que mostra a saúde da aplicação (se está rodando, se o banco está conectado, etc).

**Analogia Python:** É como ter um `/health` que você sempre cria manualmente, mas o Spring Boot já vem com isso.

**Como funciona:**
- Spring Boot Actuator adiciona endpoints de monitoramento
- `/actuator/health` verifica: aplicação rodando? Banco conectado? Disco OK?
- Útil para Docker healthchecks e monitoramento

**Exemplo de resposta:**
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"}
  }
}
```

### 3.4 React Component com TypeScript

**O que é:** Uma função TypeScript que retorna JSX (HTML-like) para renderizar na tela.

**Analogia Python:** É como uma função que retorna uma string HTML, mas reativa (atualiza sozinha quando dados mudam).

**Exemplo:**
```tsx
function App() {
  return (
    <div>
      <h1>Plataforma de Cursos</h1>
      <p>Bem-vindo!</p>
    </div>
  );
}
```

**O que acontece:**
- `function App()` = componente React (função que retorna UI)
- JSX (`<div>...</div>`) = HTML dentro do JavaScript
- TypeScript adiciona tipos: `function App(): JSX.Element`

**Comparação Python:**
```python
# Python (template string)
def render_home():
    return """
    <div>
        <h1>Plataforma de Cursos</h1>
        <p>Bem-vindo!</p>
    </div>
    """

# React (componente reativo)
function App() {
    return (
        <div>
            <h1>Plataforma de Cursos</h1>
            <p>Bem-vindo!</p>
        </div>
    );
}
```

### 3.5 Vite Dev Server

**O que é:** Servidor de desenvolvimento ultra-rápido para React/TypeScript.

**Analogia Python:** É como o `python -m http.server`, mas:
- Compila TypeScript → JavaScript na hora
- Recarrega automaticamente quando você salva
- Muito mais rápido que Webpack

**Como usar:**
```bash
npm run dev  # Inicia servidor em http://localhost:5173
```

### 3.6 Docker Compose - Conexão entre Serviços

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

### 3.7 Maven (pom.xml)

**O que é:** Gerenciador de dependências e build para Java (como npm para Node, pip para Python).

**Analogia Python:** `pom.xml` = `requirements.txt` + `setup.py` + ferramenta de build.

**Estrutura básica:**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!-- Não precisa versão! Spring Boot gerencia -->
    </dependency>
</dependencies>
```

**Comandos principais:**
- `mvn clean install` = instala dependências + compila
- `mvn spring-boot:run` = roda a aplicação
- `mvn test` = roda testes

### 3.8 package.json (Node/React)

**O que é:** Arquivo que lista dependências e scripts do projeto frontend.

**Analogia Python:** É como `requirements.txt` + `setup.py` + scripts shell.

**Estrutura:**
```json
{
  "dependencies": {
    "react": "^18.2.0"  // Dependências de produção
  },
  "devDependencies": {
    "typescript": "^5.2.2"  // Dependências de desenvolvimento
  },
  "scripts": {
    "dev": "vite"  // npm run dev executa "vite"
  }
}
```

### 3.9 application.yml

**O que é:** Arquivo de configuração do Spring Boot (substitui muitas configurações em código).

**Analogia Python:** É como `.env` + `config.py` juntos.

**Exemplo:**
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/plataforma_cursos}
    #                              ↑ variável de ambiente  ↑ valor padrão
```

**Sintaxe:**
- `spring.datasource.url` = propriedade aninhada
- `${VAR:default}` = usa variável de ambiente ou valor padrão

### 3.10 Conventional Commits

**O que é:** Padrão de mensagens de commit que facilita versionamento semântico.

**Formato:**
```
<type>(<scope>): <summary>

[body opcional]

[footer opcional]
```

**Tipos comuns:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `chore`: tarefas de manutenção (deps, config)

**Exemplo:**
```
feat(backend): adiciona endpoint /api/v1/ping

- Implementa PingController com resposta JSON
- Adiciona testes básicos de integração

Closes #123
```

### 3.11 Estrutura de Pastas Java

**O que é:** Convenção Maven de onde colocar código fonte, recursos, testes.

**Estrutura:**
```
src/
  main/
    java/com/plataforma/cursos/    # Código fonte (.java)
      Application.java
      controller/
      service/
    resources/                     # Configurações (.yml, .properties)
      application.yml
  test/
    java/com/plataforma/cursos/    # Testes (.java)
```

**Por quê:** Maven compila tudo em `src/main/java` e coloca em `target/classes`.

### 3.12 Estrutura de Pastas React

**O que é:** Convenção Vite de onde colocar componentes, assets, configurações.

**Estrutura:**
```
src/
  App.tsx           # Componente principal
  main.tsx          # Ponto de entrada (como index.js)
  index.css         # Estilos globais
public/             # Arquivos estáticos (não processados)
```

**Por quê:** Vite processa `src/` e serve `public/` diretamente.

## 4. O que foi implementado (lista)

### Backend (Spring Boot)
- [x] Classe principal `PlataformaCursosApplication` com `@SpringBootApplication`
- [x] `PingController` com endpoint `/api/v1/ping`
- [x] Configuração do Actuator para `/actuator/health`
- [x] `application.yml` com configurações básicas
- [x] `pom.xml` com dependências necessárias

### Frontend (React + Vite)
- [x] Componente `App.tsx` exibindo "Plataforma de Cursos"
- [x] `main.tsx` como ponto de entrada
- [x] `index.html` básico
- [x] `vite.config.ts` configurado
- [x] `package.json` com dependências React + TypeScript

### Infraestrutura
- [x] `docker-compose.yml` com PostgreSQL, Backend e Frontend
- [x] Healthchecks configurados
- [x] Variáveis de ambiente para configuração

### Documentação
- [x] README.md atualizado com instruções
- [x] Pasta `/learning` criada
- [x] Documento `BLOCO-1-inicializacao-profissional.md` (este arquivo)
- [x] Documento `COMO-ESTUDAR-COM-O-AGENTE.md`

## 5. Arquivos importantes e por quê

### Backend

**`backend/src/main/java/com/plataforma/cursos/PlataformaCursosApplication.java`**
- **O que faz:** Classe principal que inicia o Spring Boot
- **Por que importa:** Sem ela, a aplicação não inicia
- **Analogia:** É o `main()` do programa

**`backend/src/main/java/com/plataforma/cursos/controller/PingController.java`**
- **O que faz:** Define o endpoint `/api/v1/ping`
- **Por que importa:** É seu primeiro endpoint REST funcionando
- **Analogia:** É como uma rota Flask `@app.route('/ping')`

**`backend/pom.xml`**
- **O que faz:** Define dependências e configuração do Maven
- **Por que importa:** Sem ele, não tem Spring Boot, PostgreSQL driver, etc.
- **Analogia:** É o `requirements.txt` do Python

**`backend/src/main/resources/application.yml`**
- **O que faz:** Configurações da aplicação (porta, banco, etc)
- **Por que importa:** Define como a aplicação se conecta ao PostgreSQL
- **Analogia:** É o `.env` + `config.py` juntos

### Frontend

**`frontend/src/App.tsx`**
- **O que faz:** Componente principal que renderiza a tela
- **Por que importa:** É o que o usuário vê no navegador
- **Analogia:** É o template HTML principal

**`frontend/src/main.tsx`**
- **O que faz:** Ponto de entrada que renderiza `App` no DOM
- **Por que importa:** Sem ele, React não sabe onde começar
- **Analogia:** É o `index.js` que chama `ReactDOM.render()`

**`frontend/vite.config.ts`**
- **O que faz:** Configuração do Vite (porta, proxy, etc)
- **Por que importa:** Define como o dev server funciona
- **Analogia:** É configuração do servidor de desenvolvimento

**`frontend/package.json`**
- **O que faz:** Lista dependências e scripts npm
- **Por que importa:** Define o que instalar e como rodar
- **Analogia:** É o `requirements.txt` do Node.js

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
- Java 21 (para desenvolvimento local)
- Node.js 20+ (para desenvolvimento local)
- Maven 3.9+ (para desenvolvimento local)

### Opção 1: Docker Compose (Recomendado para começar)

**1. Subir todos os serviços:**
```bash
docker-compose up -d
```

**2. Verificar logs:**
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

**3. Testar endpoints:**

**Health Check:**
```bash
curl http://localhost:8080/actuator/health
```
**Resposta esperada:**
```json
{"status":"UP"}
```

**Ping Endpoint:**
```bash
curl http://localhost:8080/api/v1/ping
```
**Resposta esperada:**
```json
{"status":"ok","message":"pong"}
```

**4. Acessar frontend:**
- Abra o navegador em: http://localhost:3000
- Deve exibir: "Plataforma de Cursos"

**5. Parar serviços:**
```bash
docker-compose down
```

### Opção 2: Desenvolvimento Local (Para aprender melhor)

**Backend:**

```bash
cd backend

# Instalar dependências e compilar
mvn clean install

# Rodar aplicação
mvn spring-boot:run
```

**Frontend (em outro terminal):**

```bash
cd frontend

# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

**PostgreSQL (via Docker):**
```bash
docker run -d \
  --name postgres-local \
  -e POSTGRES_USER=plataforma \
  -e POSTGRES_PASSWORD=plataforma123 \
  -e POSTGRES_DB=plataforma_cursos \
  -p 5432:5432 \
  postgres:16-alpine
```

### Comandos Úteis

**Verificar se backend está rodando:**
```bash
curl http://localhost:8080/actuator/health
```

**Verificar se frontend está rodando:**
```bash
curl http://localhost:3000
```

**Verificar se PostgreSQL está rodando:**
```bash
# PostgreSQL não está acessível externamente (porta 5432 não exposta)
# Acesso apenas via docker exec (recomendado para segurança)
docker exec -it plataforma-postgres psql -U plataforma -d plataforma_cursos -c "SELECT version();"
```

**Rebuild após mudanças:**
```bash
# Backend
docker-compose up -d --build backend

# Frontend
docker-compose up -d --build frontend

# Tudo
docker-compose up -d --build
```

## 7. Erros comuns e como diagnosticar

### Erro 1: "Connection refused" ao acessar backend

**Sintomas:**
```
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

**Causas possíveis:**
1. Backend não iniciou
2. Porta 8080 já está em uso
3. Container não está rodando

**Como diagnosticar:**
```bash
# Verificar se container está rodando
docker-compose ps

# Ver logs do backend
docker-compose logs backend

# Verificar se porta está em uso
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # Linux/Mac
```

**Solução:**
- Se container não está rodando: `docker-compose up -d backend`
- Se porta em uso: mude `BACKEND_PORT` no `.env` ou pare o processo que usa a porta
- Se erro nos logs: leia a mensagem de erro completa

### Erro 2: "Cannot connect to database"

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

### Erro 3: Frontend não carrega

**Sintomas:**
- Página em branco
- Erro 502 Bad Gateway
- "Cannot GET /"

**Causas possíveis:**
1. Frontend não compilou
2. Nginx não está rodando
3. Porta errada

**Como diagnosticar:**
```bash
# Ver logs do frontend
docker-compose logs frontend

# Verificar se container está rodando
docker-compose ps frontend

# Testar acesso direto
curl http://localhost:3000
```

**Solução:**
- Verificar logs de build do frontend
- Rebuild: `docker-compose up -d --build frontend`
- Verificar `FRONTEND_PORT` no `.env`

### Erro 4: "Port already in use"

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

### Erro 5: Maven não encontra dependências

**Sintomas:**
```
[ERROR] Failed to execute goal ... Could not resolve dependencies
```

**Causas possíveis:**
1. Sem internet
2. Repositório Maven inacessível
3. Versão de dependência inválida

**Solução:**
```bash
# Limpar cache do Maven
mvn clean

# Forçar atualização
mvn clean install -U

# Verificar conexão
ping repo.maven.apache.org
```

### Erro 6: npm install falha

**Sintomas:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Causas possíveis:**
1. Versões incompatíveis
2. Cache corrompido
3. Node.js versão errada

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version  # Deve ser 20+
```

## 8. Exercícios para eu fazer (3 exercícios)

### Exercício 1: Adicionar novo endpoint "info"

**Objetivo:** Criar um endpoint que retorna informações sobre a aplicação.

**Passos:**
1. Crie uma nova classe `InfoController` em `backend/src/main/java/com/plataforma/cursos/controller/InfoController.java`
2. Adicione o endpoint `GET /api/v1/info` que retorna:
   ```json
   {
     "name": "Plataforma de Cursos",
     "version": "1.0.0",
     "description": "Plataforma privada de cursos offline"
   }
   ```
3. Teste com: `curl http://localhost:8080/api/v1/info`

**Critério de "deu certo":**
- Endpoint responde com status 200
- JSON retornado tem os 3 campos acima
- Logs do Spring Boot mostram a requisição

**Dica:** Use `@RestController` e `@GetMapping` como no `PingController`.

---

### Exercício 2: Modificar componente React para exibir data atual

**Objetivo:** Adicionar a data atual na tela do frontend.

**Passos:**
1. Abra `frontend/src/App.tsx`
2. Adicione um `<p>` que mostra a data atual formatada
3. Use `new Date().toLocaleDateString('pt-BR')` para formatar

**Resultado esperado:**
```tsx
function App() {
  return (
    <div>
      <h1>Plataforma de Cursos</h1>
      <p>Data atual: {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  );
}
```

**Critério de "deu certo":**
- Tela mostra "Data atual: DD/MM/AAAA"
- Data atualiza quando você recarrega a página
- Não há erros no console do navegador

**Dica:** JSX permite JavaScript entre `{}`.

---

### Exercício 3: Adicionar variável de ambiente no docker-compose

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

### Extrair mensagens para constantes

**O que fazer:**
- No `PingController`, ao invés de retornar `Map.of("status", "ok", "message", "pong")` diretamente, crie constantes:
  ```java
  private static final String STATUS_OK = "ok";
  private static final String MESSAGE_PONG = "pong";
  ```
- Use essas constantes no retorno do método.

**Por que fazer:**
- Facilita manutenção (mudar em um lugar só)
- Evita typos (compilador pega erros)
- Código mais legível

**Como testar:**
- Endpoint ainda funciona igual
- Código fica mais organizado

**Desafio extra:** Crie uma classe `ApiResponse` para padronizar respostas:
```java
public class ApiResponse {
    private String status;
    private String message;
    // getters, setters, construtor
}
```

## 10. Checklist de validação (passo a passo)

Use este checklist para garantir que tudo está funcionando:

### ✅ Infraestrutura

- [ ] Docker e Docker Compose instalados e funcionando
- [ ] Comando `docker-compose up -d` executa sem erros
- [ ] Todos os 3 containers estão rodando (`docker-compose ps`)
- [ ] PostgreSQL está saudável (healthcheck passou)

### ✅ Backend

- [ ] Backend inicia sem erros (verificar logs)
- [ ] Endpoint `/actuator/health` retorna `{"status":"UP"}`
- [ ] Endpoint `/api/v1/ping` retorna `{"status":"ok","message":"pong"}`
- [ ] Logs mostram "Started PlataformaCursosApplication"
- [ ] Backend conecta no PostgreSQL (sem erros de conexão nos logs)

### ✅ Frontend

- [ ] Frontend compila sem erros
- [ ] Acessando http://localhost:3000 mostra "Plataforma de Cursos"
- [ ] Console do navegador não tem erros (F12 → Console)
- [ ] Página recarrega quando você salva mudanças (hot reload)

### ✅ Integração

- [ ] Backend e Frontend estão na mesma rede Docker
- [ ] Frontend consegue fazer requisições para backend (se configurado)
- [ ] Variáveis de ambiente estão sendo lidas corretamente

### ✅ Segurança

- [ ] PostgreSQL não está acessível externamente (porta 5432 não exposta)
- [ ] Acesso ao banco apenas via rede Docker interna
- [ ] Backend conecta corretamente via nome do serviço `postgres:5432`

### ✅ Documentação

- [ ] README.md tem instruções claras
- [ ] Documento `BLOCO-1-inicializacao-profissional.md` existe e está completo
- [ ] Documento `COMO-ESTUDAR-COM-O-AGENTE.md` existe

### ✅ Código

- [ ] Código Java compila sem warnings (`mvn clean compile`)
- [ ] Código TypeScript compila sem erros (`npm run build`)
- [ ] Não há TODOs críticos deixados no código
- [ ] Commits seguem Conventional Commits

---

## Checkpoint: O que você deve conseguir explicar agora

Após completar este bloco, você deve conseguir explicar:

1. **O que é Spring Boot e por que usar:** Framework que facilita criar APIs REST com convenções sensatas
2. **Como um endpoint REST funciona no Spring:** `@RestController` + `@GetMapping` = endpoint HTTP
3. **O que é Actuator:** Endpoints de monitoramento pré-configurados pelo Spring Boot
4. **Como React renderiza componentes:** Funções que retornam JSX são transformadas em HTML
5. **Como Docker Compose conecta serviços:** `depends_on` + `networks` + variáveis de ambiente
6. **Estrutura básica de projeto Java:** `src/main/java` para código, `src/main/resources` para config
7. **Estrutura básica de projeto React:** `src/` para código, `public/` para assets estáticos

## O que revisar se travar

Se você travar em algum ponto, revise:

- **Backend não inicia:** Verifique logs (`docker-compose logs backend`), veja se PostgreSQL está pronto, verifique `application.yml`
- **Frontend não carrega:** Verifique logs (`docker-compose logs frontend`), veja se compilou sem erros, verifique porta
- **Não entende anotações:** Leia a seção "Conceitos explicados" novamente, pesquise `@SpringBootApplication` no Google
- **Docker não funciona:** Verifique se Docker Desktop está rodando, verifique portas em uso

## Próximo bloco sugerido

**Bloco 2: Primeira Entidade e CRUD Básico**
- Criar entidade `Curso` (id, nome, descrição)
- Criar `CursoRepository` (Spring Data JPA)
- Criar `CursoController` com CRUD completo
- Frontend: listar cursos em uma tabela
- Aprender: JPA Entities, Repositories, DTOs, Validações

---

**Boa sorte no aprendizado! 🚀**

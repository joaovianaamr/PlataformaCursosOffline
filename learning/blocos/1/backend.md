# Bloco 1: Backend

## 1. Objetivo do bloco

Criar a base de uma aplicação Spring Boot profissional:
- Backend Spring Boot rodando e respondendo em `/actuator/health` e `/api/v1/ping`
- Endpoint `/api/v1/info` retornando informações da aplicação
- Configuração básica com Maven e `application.yml`
- Documentação completa para desenvolvimento

**Resultado esperado:** Você consegue rodar o backend, acessar os endpoints e entender como o Spring Boot funciona.

## 2. O que eu devo aprender neste bloco (6 itens)

1. **Estrutura de um projeto Spring Boot**: Como o Maven organiza o código Java e onde cada coisa fica
2. **Anotações básicas do Spring**: `@SpringBootApplication`, `@RestController`, `@GetMapping` - o que fazem e por quê
3. **Actuator Health Endpoint**: Endpoint pré-configurado para monitoramento
4. **Maven (pom.xml)**: Gerenciador de dependências e build para Java
5. **application.yml**: Arquivo de configuração do Spring Boot
6. **Spring Security e rotas públicas**: Como configurar quais endpoints podem ser acessados sem autenticação

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

### 3.4 Maven (pom.xml)

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

**Dependências principais usadas neste projeto:**
- `spring-boot-starter-web` = Cria servidor HTTP e endpoints REST
- `spring-boot-starter-data-jpa` = Integração com banco de dados (PostgreSQL)
- `spring-boot-starter-security` = **Spring Security** - proteção de rotas e autenticação
- `spring-boot-starter-actuator` = Endpoints de monitoramento (`/actuator/health`)
- `spring-boot-starter-validation` = Validação de dados de entrada
- `postgresql` = Driver para conectar ao PostgreSQL
- `jjwt-*` = Biblioteca para trabalhar com JWT (JSON Web Tokens)
- `lombok` = Reduz código boilerplate (getters, setters, etc)

**Comandos principais:**
- `mvn clean install` = instala dependências + compila
- `mvn spring-boot:run` = roda a aplicação
- `mvn test` = roda testes
- `mvn clean compile` = compila sem instalar

### 3.5 application.yml

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

**Configurações principais no projeto:**

**1. Banco de dados (PostgreSQL):**
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/plataforma_cursos}
    username: ${SPRING_DATASOURCE_USERNAME:plataforma}
    password: ${SPRING_DATASOURCE_PASSWORD:plataforma123}
```
- Define como conectar ao PostgreSQL
- Usa variáveis de ambiente ou valores padrão

**2. JPA/Hibernate:**
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Valida schema, não cria/modifica tabelas
    show-sql: false       # Não mostra SQL no console (mude para true para debug)
```
- `ddl-auto: validate` = Verifica se tabelas existem, mas não cria automaticamente
- `show-sql: true` = Útil para debug, mostra SQL executado

**3. Servidor:**
```yaml
server:
  port: ${SERVER_PORT:8080}  # Porta do servidor (padrão: 8080)
```

**4. JWT (JSON Web Tokens):**
```yaml
jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production-min-256-bits}
  expiration: ${JWT_EXPIRATION:86400000}  # 24 horas em milissegundos
```
- Configuração para autenticação com JWT (será usado futuramente)

**5. CORS (Cross-Origin Resource Sharing):**
```yaml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:5173}
```
- Define quais origens podem acessar a API (frontend React)

**6. Logging:**
```yaml
logging:
  level:
    com.plataforma.cursos: DEBUG  # Logs detalhados da aplicação
    org.springframework.security: DEBUG  # Logs de segurança
```
- Controla nível de detalhamento dos logs
- `DEBUG` = muito detalhado, `INFO` = menos detalhado

### 3.6 Estrutura de Pastas Java

**O que é:** Convenção Maven de onde colocar código fonte, recursos, testes.

**Estrutura:**
```
src/
  main/
    java/com/plataforma/cursos/    # Código fonte (.java)
      PlataformaCursosApplication.java  # Classe principal
      controller/                  # Endpoints REST (PingController, InfoController)
      service/                     # Lógica de negócio (futuro)
      repository/                  # Acesso ao banco de dados (futuro)
      model/                       # Entidades JPA (futuro)
      dto/                         # Data Transfer Objects (futuro)
      config/                      # Configurações (SecurityConfig, etc)
      exception/                   # Tratamento de erros (futuro)
    resources/                     # Configurações (.yml, .properties)
      application.yml
  test/
    java/com/plataforma/cursos/    # Testes (.java)
```

**Por quê:** Maven compila tudo em `src/main/java` e coloca em `target/classes`.

**Camadas da aplicação (arquitetura):**
- **Controller** (`controller/`) = Recebe requisições HTTP, valida entrada, retorna resposta
- **Service** (`service/`) = Contém a lógica de negócio da aplicação
- **Repository** (`repository/`) = Acesso ao banco de dados (Spring Data JPA)
- **Model** (`model/`) = Entidades que representam tabelas do banco
- **DTO** (`dto/`) = Objetos para transferir dados entre camadas
- **Config** (`config/`) = Configurações (Security, CORS, etc)
- **Exception** (`exception/`) = Tratamento centralizado de erros

### 3.7 Spring Security e SecurityConfig

**O que é:** Configuração que define quais rotas podem ser acessadas sem autenticação e como a segurança funciona na aplicação.

**Analogia Python:** É como ter um guarda na porta que verifica se você tem permissão para entrar. Por padrão, o Spring Security bloqueia TODAS as rotas. Você precisa explicitamente permitir rotas públicas.

**Por que importa:** Sem configurar rotas públicas, você receberá erro 401 (Unauthorized) ao tentar acessar qualquer endpoint, mesmo os que deveriam ser públicos.

**Exemplo:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Desabilita CSRF (comum em APIs REST)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()      // Rotas públicas
                .requestMatchers("/api/v1/ping").permitAll()
                .requestMatchers("/api/v1/info").permitAll()
                .anyRequest().authenticated()  // Resto precisa autenticação
            );
        return http.build();
    }
}
```

**O que acontece:**
- `@Configuration` = "Esta classe configura algo"
- `@EnableWebSecurity` = "Ativa Spring Security nesta aplicação"
- `csrf.disable()` = "Desabilita proteção CSRF" (comum em APIs REST que usam JWT)
- `requestMatchers("/api/v1/ping").permitAll()` = "Permite acesso sem autenticação"
- `.anyRequest().authenticated()` = "Todas as outras rotas precisam de autenticação"

**Regra importante:** Quando criar um novo endpoint público, você DEVE adicioná-lo em `requestMatchers().permitAll()`. Caso contrário, receberá erro 401 (Unauthorized).

**Comparação Python:**
```python
# Python (Flask) - você precisa criar decorator manualmente
from functools import wraps

def public_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/v1/ping')
@public_route
def ping():
    return jsonify({"status": "ok"})

# Java (Spring Boot) - configuração centralizada
# Todas as rotas públicas em um lugar só (SecurityConfig)
```

**O que é CSRF?**
- Cross-Site Request Forgery = ataque onde um site malicioso faz requisições em seu nome
- Em APIs REST com JWT, geralmente desabilitamos porque o token já protege
- Em aplicações web tradicionais (com cookies), geralmente mantemos habilitado

## 4. O que foi implementado (lista)

### Backend (Spring Boot)
- [x] Classe principal `PlataformaCursosApplication` com `@SpringBootApplication`
- [x] `PingController` com endpoint `/api/v1/ping`
- [x] `InfoController` com endpoint `/api/v1/info`
- [x] Configuração do Actuator para `/actuator/health`
- [x] `application.yml` com configurações básicas
- [x] `pom.xml` com dependências necessárias
- [x] `SecurityConfig` básico (se necessário)

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

**`backend/src/main/java/com/plataforma/cursos/controller/InfoController.java`**
- **O que faz:** Define o endpoint `/api/v1/info`
- **Por que importa:** Retorna informações sobre a aplicação
- **Analogia:** É como um endpoint de status/versão

**`backend/pom.xml`**
- **O que faz:** Define dependências e configuração do Maven
- **Por que importa:** Sem ele, não tem Spring Boot, PostgreSQL driver, etc.
- **Analogia:** É o `requirements.txt` do Python

**`backend/src/main/resources/application.yml`**
- **O que faz:** Configurações da aplicação (porta, banco, etc)
- **Por que importa:** Define como a aplicação se conecta ao PostgreSQL
- **Analogia:** É o `.env` + `config.py` juntos

**`backend/src/main/java/com/plataforma/cursos/config/SecurityConfig.java`**
- **O que faz:** Configura quais rotas são públicas (sem autenticação) e quais precisam de autenticação
- **Por que importa:** Sem ele, todas as rotas ficam bloqueadas e você recebe erro 401
- **Analogia:** É como uma lista de convidados VIP - só quem está na lista pode entrar sem autenticação
- **Importante:** Sempre que criar um novo endpoint público, adicione-o aqui com `requestMatchers().permitAll()`

## 6. Como rodar e testar (comandos)

### Pré-requisitos
- Java 21 instalado
- Maven 3.9+ instalado
- PostgreSQL rodando (via Docker Compose ou local)

### Opção 1: Docker Compose (Recomendado)

**1. Subir todos os serviços:**
```bash
docker-compose up -d
```

**2. Verificar logs do backend:**
```bash
docker-compose logs -f backend
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

**Info Endpoint:**
```bash
curl http://localhost:8080/api/v1/info
```
**Resposta esperada:**
```json
{"name":"Plataforma de cursos","version":"1.0.0","description":"Plataforma privada de cursos offline"}
```

### Opção 2: Desenvolvimento Local

**Backend:**
```bash
cd backend

# Instalar dependências e compilar
mvn clean install

# Rodar aplicação
mvn spring-boot:run
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

**Compilar sem rodar:**
```bash
mvn clean compile
```

**Rodar testes:**
```bash
mvn test
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
4. URL de conexão errada (deve usar `postgres:5432`, não `localhost:5432`)

**Como diagnosticar:**
```bash
# Verificar se PostgreSQL está saudável
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Ver logs do backend
docker-compose logs backend
```

**Solução:**
- Aguardar PostgreSQL ficar saudável (healthcheck)
- Verificar variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Verificar `SPRING_DATASOURCE_URL` no backend (deve usar `postgres:5432`, não `localhost:5432`)

### Erro 3: Maven não encontra dependências

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

### Erro 5: "401 Unauthorized" ao acessar endpoint

**Sintomas:**
```
HTTP/1.1 401 Unauthorized
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "path": "/api/v1/info"
}
```

**Ou no curl:**
```bash
curl http://localhost:8080/api/v1/info
# Retorna: {"timestamp":"...","status":401,"error":"Unauthorized",...}
```

**Causa:** A rota não está configurada como pública no `SecurityConfig.java`. Por padrão, o Spring Security bloqueia todas as rotas que não estão explicitamente permitidas.

**Como diagnosticar:**
1. Verifique se o endpoint existe no controller
2. Verifique se a rota está em `requestMatchers().permitAll()` no `SecurityConfig.java`
3. Verifique os logs do Spring Boot - geralmente mostra tentativas de acesso bloqueadas

**Solução:**
Adicione a rota no `SecurityConfig.java`:
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/actuator/**").permitAll()
    .requestMatchers("/api/v1/ping").permitAll()
    .requestMatchers("/api/v1/info").permitAll()  // ← Adicione aqui
    .anyRequest().authenticated()
);
```

**Importante:** Após modificar `SecurityConfig.java`, você precisa reiniciar a aplicação para as mudanças terem efeito.

### Erro 6: "403 Forbidden" mesmo com rota permitida

**Sintomas:**
```
HTTP/1.1 403 Forbidden
```

**Causa:** Geralmente relacionado a CSRF (Cross-Site Request Forgery) ou configuração incorreta de CORS.

**Solução:**
- Verifique se `csrf.disable()` está configurado no `SecurityConfig` (comum em APIs REST)
- Verifique configurações de CORS no `application.yml` ou em uma classe de configuração separada

## 8. Exercícios para eu fazer (1 exercício)

### Exercício 1: Adicionar novo endpoint "info"

**Objetivo:** Criar um endpoint que retorna informações sobre a aplicação.

**Status:** ✅ Completo

O `InfoController` já foi implementado e está funcionando. Você pode testá-lo com:
```bash
curl http://localhost:8080/api/v1/info
```

**O que foi feito:**
1. Criada classe `InfoController` em `backend/src/main/java/com/plataforma/cursos/controller/InfoController.java`
2. Adicionado endpoint `GET /api/v1/info` que retorna:
   ```json
   {
     "name": "Plataforma de cursos",
     "version": "1.0.0",
     "description": "Plataforma privada de cursos offline"
   }
   ```

**Critério de "deu certo":**
- ✅ Endpoint responde com status 200
- ✅ JSON retornado tem os 3 campos acima
- ✅ Logs do Spring Boot mostram a requisição

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

### ✅ Backend

- [ ] Backend inicia sem erros (verificar logs)
- [ ] Endpoint `/actuator/health` retorna `{"status":"UP"}`
- [ ] Endpoint `/api/v1/ping` retorna `{"status":"ok","message":"pong"}`
- [ ] Endpoint `/api/v1/info` retorna informações da aplicação
- [ ] Logs mostram "Started PlataformaCursosApplication"
- [ ] Backend conecta no PostgreSQL (sem erros de conexão nos logs)
- [ ] Endpoints públicos funcionam sem autenticação (sem erro 401)
- [ ] `SecurityConfig.java` está configurado corretamente com rotas públicas

### ✅ Código

- [ ] Código Java compila sem warnings (`mvn clean compile`)
- [ ] Não há TODOs críticos deixados no código
- [ ] Commits seguem Conventional Commits

---

## Checkpoint: O que você deve conseguir explicar agora

Após completar este bloco, você deve conseguir explicar:

1. **O que é Spring Boot e por que usar:** Framework que facilita criar APIs REST com convenções sensatas
2. **Como um endpoint REST funciona no Spring:** `@RestController` + `@GetMapping` = endpoint HTTP
3. **O que é Actuator:** Endpoints de monitoramento pré-configurados pelo Spring Boot
4. **Estrutura básica de projeto Java:** `src/main/java` para código, `src/main/resources` para config
5. **Como Maven funciona:** Gerenciador de dependências e build para Java
6. **Como Spring Security funciona:** Por padrão bloqueia todas as rotas; você precisa permitir rotas públicas explicitamente no `SecurityConfig`

## O que revisar se travar

Se você travar em algum ponto, revise:

- **Backend não inicia:** Verifique logs (`docker-compose logs backend`), veja se PostgreSQL está pronto, verifique `application.yml`
- **Não entende anotações:** Leia a seção "Conceitos explicados" novamente, pesquise `@SpringBootApplication` no Google
- **Maven não funciona:** Verifique se Maven está instalado (`mvn --version`), verifique conexão com internet
- **Erro 401 ao acessar endpoint:** Verifique se a rota está em `requestMatchers().permitAll()` no `SecurityConfig.java` e reinicie a aplicação

## Próximo bloco sugerido

**Bloco 1 - Frontend:** React + Vite rodando, componente inicial

# Arquivos Gerados Automaticamente vs Configurados Manualmente

Este documento explica quais arquivos do projeto são gerados automaticamente por comandos como `npm install`, `mvn compile`, `npm run build`, etc., e quais são configurados manualmente pelo desenvolvedor.

## Por que isso é importante?

Entender essa diferença ajuda você a:
- **Saber o que versionar no Git**: Arquivos gerados não devem ser commitados
- **Entender o que pode ser deletado**: Arquivos gerados podem ser recriados
- **Saber onde fazer mudanças**: Modifique apenas arquivos manuais
- **Troubleshooting**: Se algo quebrar, você sabe onde procurar

## 📁 Arquivos Gerados Automaticamente

Estes arquivos são criados/atualizados por comandos e **NÃO devem ser editados manualmente**.

### Frontend (Node.js/npm)

#### `node_modules/`
- **Gerado por:** `npm install`
- **O que é:** Todas as dependências do projeto (React, Vite, TypeScript, etc.)
- **Pode deletar?** Sim, rode `npm install` novamente para recriar
- **Versionar no Git?** ❌ Não (já está no `.gitignore`)

#### `package-lock.json`
- **Gerado por:** `npm install` (atualizado automaticamente)
- **O que é:** Lock file que garante versões exatas das dependências
- **Pode deletar?** Sim, mas é recomendado manter para garantir builds consistentes
- **Versionar no Git?** ✅ Sim (importante para builds reproduzíveis)

#### `dist/`
- **Gerado por:** `npm run build` (comando do Vite)
- **O que é:** Arquivos compilados e otimizados para produção (JS minificado, CSS, HTML)
- **Pode deletar?** Sim, rode `npm run build` novamente
- **Versionar no Git?** ❌ Não (já está no `.gitignore`)

#### Arquivos dentro de `dist/`
- `dist/assets/index-*.js` - JavaScript compilado e minificado
- `dist/assets/index-*.css` - CSS compilado
- `dist/index.html` - HTML gerado pelo build

### Backend (Maven/Java)

#### `target/`
- **Gerado por:** `mvn compile`, `mvn package`, `mvn install`
- **O que é:** Diretório com todos os artefatos compilados
- **Pode deletar?** Sim, rode `mvn clean compile` para recriar
- **Versionar no Git?** ❌ Não (já está no `.gitignore`)

#### Conteúdo de `target/`:

**`target/classes/`**
- **Gerado por:** `mvn compile`
- **O que é:** Arquivos `.class` compilados a partir do código `.java`
- **Exemplo:** `PingController.java` → `PingController.class`

**`target/cursos-1.0.0.jar`**
- **Gerado por:** `mvn package`
- **O que é:** JAR executável com toda a aplicação empacotada
- **Uso:** Pode ser executado com `java -jar target/cursos-1.0.0.jar`

**`target/generated-sources/`**
- **Gerado por:** Processadores de anotações (ex: Lombok)
- **O que é:** Código Java gerado automaticamente a partir de anotações
- **Exemplo:** Lombok gera getters/setters automaticamente

**`target/maven-archiver/`**
- **Gerado por:** Maven durante o empacotamento
- **O que é:** Metadados do build (versão, data, etc.)

**`target/maven-status/`**
- **Gerado por:** Maven durante a compilação
- **O que é:** Status e logs do processo de compilação

#### Arquivos `.class`
- **Gerado por:** Compilador Java (`javac` via Maven)
- **O que é:** Bytecode Java compilado
- **Pode deletar?** Sim, serão recriados na próxima compilação
- **Versionar no Git?** ❌ Não

### Ambos (Frontend e Backend)

#### Arquivos de log
- `*.log` - Logs de execução
- `npm-debug.log*` - Logs de debug do npm
- **Versionar no Git?** ❌ Não

#### Arquivos temporários da IDE
- `.idea/`, `.vscode/` - Configurações da IDE
- `*.iml`, `*.ipr`, `*.iws` - Arquivos do IntelliJ IDEA
- **Versionar no Git?** ❌ Não (preferencialmente, cada dev configura sua IDE)

## 📝 Arquivos Configurados Manualmente

Estes arquivos são criados e editados **pelo desenvolvedor** e devem ser versionados no Git.

### Frontend

#### `package.json`
- **O que é:** Manifesto do projeto Node.js com dependências e scripts
- **Edite quando:** Adicionar/remover dependências, criar novos scripts
- **Versionar no Git?** ✅ Sim (essencial)

#### `tsconfig.json`
- **O que é:** Configuração do compilador TypeScript
- **Edite quando:** Mudar opções de compilação, paths, strict mode
- **Versionar no Git?** ✅ Sim

#### `tsconfig.node.json`
- **O que é:** Configuração TypeScript específica para ferramentas Node (Vite, etc.)
- **Edite quando:** Configurar ferramentas de build
- **Versionar no Git?** ✅ Sim

#### `vite.config.ts`
- **O que é:** Configuração do Vite (bundler e dev server)
- **Edite quando:** Mudar porta, proxy, configurações de build
- **Versionar no Git?** ✅ Sim

#### `src/` (todo o diretório)
- **O que é:** Código-fonte da aplicação (TypeScript, React, CSS)
- **Edite quando:** Desenvolver features, corrigir bugs
- **Versionar no Git?** ✅ Sim (todo o código-fonte)

#### `Dockerfile`
- **O que é:** Instruções para construir a imagem Docker do frontend
- **Edite quando:** Mudar dependências, configurações do container
- **Versionar no Git?** ✅ Sim

#### `nginx.conf`
- **O que é:** Configuração do servidor Nginx para servir o frontend
- **Edite quando:** Mudar rotas, headers, proxy
- **Versionar no Git?** ✅ Sim

#### `index.html`
- **O que é:** HTML base da aplicação
- **Edite quando:** Mudar título, meta tags, estrutura base
- **Versionar no Git?** ✅ Sim

### Backend

#### `pom.xml`
- **O que é:** Manifesto do projeto Maven com dependências e configurações
- **Edite quando:** Adicionar/remover dependências, mudar versão do Java
- **Versionar no Git?** ✅ Sim (essencial)

#### `src/main/java/` (todo o diretório)
- **O que é:** Código-fonte Java da aplicação
- **Edite quando:** Desenvolver features, criar controllers, services, etc.
- **Versionar no Git?** ✅ Sim (todo o código-fonte)

#### `src/main/resources/application.yml`
- **O que é:** Configurações da aplicação Spring Boot (banco de dados, portas, etc.)
- **Edite quando:** Mudar configurações de ambiente, banco, segurança
- **Versionar no Git?** ✅ Sim (mas cuidado com secrets - use variáveis de ambiente)

#### `Dockerfile`
- **O que é:** Instruções para construir a imagem Docker do backend
- **Edite quando:** Mudar dependências, configurações do container
- **Versionar no Git?** ✅ Sim

### Raiz do Projeto

#### `docker-compose.yml`
- **O que é:** Orquestração de containers (PostgreSQL, Backend, Frontend)
- **Edite quando:** Adicionar serviços, mudar portas, volumes
- **Versionar no Git?** ✅ Sim

#### `.gitignore`
- **O que é:** Lista de arquivos/pastas ignorados pelo Git
- **Edite quando:** Adicionar novos tipos de arquivos gerados
- **Versionar no Git?** ✅ Sim

#### `README.md`
- **O que é:** Documentação principal do projeto
- **Edite quando:** Atualizar instruções, adicionar informações
- **Versionar no Git?** ✅ Sim

#### `learning/` (todo o diretório)
- **O que é:** Documentação de aprendizado e guias
- **Edite quando:** Adicionar novos blocos, atualizar documentação
- **Versionar no Git?** ✅ Sim

#### `rules/` (todo o diretório)
- **O que é:** Regras e convenções do projeto
- **Edite quando:** Atualizar regras de commit, padrões de código
- **Versionar no Git?** ✅ Sim

#### `videos/` (todo o diretório)
- **O que é:** Vídeos do curso (se houver)
- **Edite quando:** Adicionar novos vídeos
- **Versionar no Git?** ⚠️ Depende (vídeos são grandes - considere Git LFS ou armazenamento externo)

## 🔍 Como Identificar Rapidamente

### Teste Rápido: "Posso deletar e recriar?"

**Se a resposta for SIM** → Arquivo gerado automaticamente
- Exemplo: `node_modules/`, `target/`, `dist/`

**Se a resposta for NÃO** → Arquivo configurado manualmente
- Exemplo: `package.json`, `pom.xml`, código em `src/`

### Verificar no `.gitignore`

Arquivos listados no `.gitignore` geralmente são gerados automaticamente:
- `node_modules/` ✅ gerado
- `target/` ✅ gerado
- `dist/` ✅ gerado
- `*.class` ✅ gerado

Arquivos **não** listados no `.gitignore` geralmente são manuais:
- `package.json` ✅ manual
- `pom.xml` ✅ manual
- `src/` ✅ manual

## 🛠️ Comandos para Recriar Arquivos Gerados

### Frontend
```bash
# Recriar node_modules
cd frontend
rm -rf node_modules package-lock.json
npm install

# Recriar dist
rm -rf dist
npm run build
```

### Backend
```bash
# Recriar target
cd backend
mvn clean compile

# Recriar JAR
mvn clean package
```

## ⚠️ Erros Comuns

### "Por que meu código não aparece?"

**Problema:** Você editou um arquivo gerado automaticamente
- Exemplo: Editou `target/classes/application.yml` em vez de `src/main/resources/application.yml`

**Solução:** Sempre edite os arquivos em `src/`, não em `target/`

### "Por que o Git está mostrando mudanças em node_modules?"

**Problema:** `.gitignore` não está funcionando ou foi commitado antes

**Solução:**
```bash
# Remover do Git (mas manter localmente)
git rm -r --cached node_modules/
git commit -m "chore: remove node_modules do controle de versão"
```

### "Por que minha mudança não aparece no build?"

**Problema:** Você editou o código-fonte mas não recompilou

**Solução:**
- Frontend: `npm run build` (ou o dev server recarrega automaticamente)
- Backend: `mvn compile` (ou o IDE faz isso automaticamente)

## 📚 Resumo Visual

```
Projeto/
├── 📝 MANUAIS (edite estes)
│   ├── package.json
│   ├── pom.xml
│   ├── src/ (todo código-fonte)
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── 🤖 GERADOS (não edite, podem ser deletados)
    ├── node_modules/ (npm install)
    ├── dist/ (npm run build)
    ├── target/ (mvn compile)
    └── *.class (compilação)
```

## ✅ Checklist de Validação

Antes de fazer commit, verifique:

- [ ] Não estou commitando `node_modules/`, `target/`, `dist/`
- [ ] Estou editando arquivos em `src/`, não em `target/` ou `dist/`
- [ ] Se adicionei novos arquivos gerados, atualizei o `.gitignore`
- [ ] Entendo a diferença entre arquivos gerados e manuais

---

**Lembre-se:** Quando em dúvida, pergunte-se: "Se eu deletar este arquivo, consigo recriá-lo com um comando?" Se sim, é gerado automaticamente. Se não, é manual e importante versionar.

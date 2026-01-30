# Bloco 1: Frontend

## 1. Objetivo do bloco

Criar a base de uma aplicação React + Vite profissional:
- Frontend React exibindo a interface inicial
- Componente principal com data atual
- TypeScript configurado
- Vite dev server funcionando

**Resultado esperado:** Você consegue acessar o frontend no navegador e ver a interface funcionando.

## 2. O que eu devo aprender neste bloco (5 itens)

1. **Estrutura de um projeto React + Vite**: Como o TypeScript e React se organizam em componentes
2. **React Component com TypeScript**: Funções que retornam JSX para renderizar na tela
3. **Vite Dev Server**: Servidor de desenvolvimento ultra-rápido para React/TypeScript
4. **package.json**: Arquivo que lista dependências e scripts do projeto frontend
5. **JSX e interpolação**: Como usar JavaScript dentro do HTML (JSX)

## 3. Conceitos explicados (explicação simples + exemplo)

### 3.1 React Component com TypeScript

**O que é:** Uma função TypeScript que retorna JSX (HTML-like) para renderizar na tela.

**Analogia Python:** É como uma função que retorna uma string HTML, mas reativa (atualiza sozinha quando dados mudam).

**Exemplo:**
```tsx
function App() {
  return (
    <div>
      <h1>Plataforma de Cursos</h1>
      <p>Bem-vindo!</p>
      <p>Data atual: {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  );
}
```

**O que acontece:**
- `function App()` = componente React (função que retorna UI)
- JSX (`<div>...</div>`) = HTML dentro do JavaScript
- TypeScript adiciona tipos: `function App(): JSX.Element`
- `{new Date().toLocaleDateString('pt-BR')}` = interpolação JavaScript no JSX

**Comparação Python:**
```python
# Python (template string)
def render_home():
    return f"""
    <div>
        <h1>Plataforma de Cursos</h1>
        <p>Bem-vindo!</p>
        <p>Data atual: {datetime.now().strftime('%d/%m/%Y')}</p>
    </div>
    """

# React (componente reativo)
function App() {
    return (
        <div>
            <h1>Plataforma de Cursos</h1>
            <p>Bem-vindo!</p>
            <p>Data atual: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
    );
}
```

### 3.2 Vite Dev Server

**O que é:** Servidor de desenvolvimento ultra-rápido para React/TypeScript.

**Analogia Python:** É como o `python -m http.server`, mas:
- Compila TypeScript → JavaScript na hora
- Recarrega automaticamente quando você salva
- Muito mais rápido que Webpack

**Como usar:**
```bash
npm run dev  # Inicia servidor em http://localhost:5173
```

**Características:**
- Hot Module Replacement (HMR): mudanças aparecem instantaneamente
- Compilação rápida: TypeScript compilado em milissegundos
- Dev server na porta 5173 (configurável)

### 3.3 package.json (Node/React)

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

**Comandos principais:**
- `npm install` = instala dependências
- `npm run dev` = inicia servidor de desenvolvimento
- `npm run build` = compila para produção
- `npm run preview` = preview da build de produção

### 3.4 JSX e Interpolação

**O que é:** Sintaxe que permite escrever HTML dentro do JavaScript e interpolar valores.

**Analogia Python:** É como f-strings do Python, mas para HTML.

**Exemplo:**
```tsx
function App() {
  const nome = "João";
  const data = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div>
      <h1>Olá, {nome}!</h1>
      <p>Data atual: {data}</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}
```

**Regras importantes:**
- `{}` = interpolação JavaScript no JSX
- Expressões JavaScript são avaliadas
- Strings são renderizadas como texto
- Números são renderizados como texto
- Arrays são renderizados como lista

### 3.5 Estrutura de Pastas React

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

### 3.6 TypeScript no React

**O que é:** TypeScript adiciona tipos ao JavaScript, prevenindo erros em tempo de compilação.

**Analogia Python:** É como type hints do Python 3.5+, mas obrigatório.

**Exemplo:**
```tsx
// Sem TypeScript (JavaScript)
function App() {
  return <div>Olá</div>;
}

// Com TypeScript
function App(): JSX.Element {
  return <div>Olá</div>;
}
```

**Benefícios:**
- Autocomplete melhor no IDE
- Erros detectados antes de rodar
- Refatoração mais segura
- Documentação implícita (tipos explicam o código)

## 4. O que foi implementado (lista)

### Frontend (React + Vite)
- [x] Componente `App.tsx` exibindo "Plataforma de Cursos"
- [x] Data atual formatada em pt-BR no componente
- [x] `main.tsx` como ponto de entrada
- [x] `index.html` básico
- [x] `vite.config.ts` configurado
- [x] `package.json` com dependências React + TypeScript
- [x] `tsconfig.json` configurado

## 5. Arquivos importantes e por quê

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

**`frontend/tsconfig.json`**
- **O que faz:** Configuração do compilador TypeScript
- **Por que importa:** Define regras de tipos e compilação
- **Analogia:** É configuração do compilador

## 6. Como rodar e testar (comandos)

### Pré-requisitos
- Node.js 20+ instalado
- npm instalado (vem com Node.js)

### Opção 1: Docker Compose (Recomendado)

**1. Subir todos os serviços:**
```bash
docker-compose up -d
```

**2. Acessar frontend:**
- Abra o navegador em: http://localhost:3000
- Deve exibir: "Plataforma de Cursos" e a data atual

**3. Verificar logs:**
```bash
docker-compose logs -f frontend
```

### Opção 2: Desenvolvimento Local

**Frontend:**
```bash
cd frontend

# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

**Acessar:**
- Abra o navegador em: http://localhost:5173
- Deve exibir: "Plataforma de Cursos" e a data atual

### Comandos Úteis

**Verificar se frontend está rodando:**
```bash
curl http://localhost:3000  # Docker
curl http://localhost:5173  # Dev local
```

**Compilar para produção:**
```bash
cd frontend
npm run build
```

**Preview da build de produção:**
```bash
cd frontend
npm run preview
```

## 7. Erros comuns e como diagnosticar

### Erro 1: Frontend não carrega

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

### Erro 2: npm install falha

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

### Erro 3: TypeScript errors

**Sintomas:**
```
error TS2304: Cannot find name 'X'
```

**Causas possíveis:**
1. Tipo não importado
2. Configuração TypeScript incorreta
3. Dependência faltando

**Solução:**
- Verificar imports
- Verificar `tsconfig.json`
- Instalar dependências faltantes: `npm install`

### Erro 4: "Port already in use"

**Sintomas:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Causas possíveis:**
1. Outra aplicação usando a porta
2. Processo anterior não foi parado

**Solução:**
- Parar processo que usa a porta
- Mudar porta no `vite.config.ts`
- Verificar processos: `lsof -i :5173` (Linux/Mac) ou `netstat -ano | findstr :5173` (Windows)

## 8. Exercícios para eu fazer

**Nenhum exercício** - O frontend será implementado completamente pelo agente conforme necessário.

**Nota:** O exercício 2 (adicionar data atual) já foi implementado pelo agente. O componente `App.tsx` agora exibe a data atual formatada em pt-BR.

## 9. Refatoração opcional (1 sugestão)

### Extrair data para variável

**O que fazer:**
- Extrair `new Date().toLocaleDateString('pt-BR')` para uma variável:
  ```tsx
  function App() {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    return (
      <div>
        <h1>Plataforma de Cursos</h1>
        <p>Data atual: {dataAtual}</p>
      </div>
    );
  }
  ```

**Por que fazer:**
- Código mais legível
- Facilita reutilização
- Facilita testes

**Como testar:**
- Componente ainda funciona igual
- Código fica mais organizado

## 10. Checklist de validação (passo a passo)

Use este checklist para garantir que tudo está funcionando:

### ✅ Frontend

- [ ] Frontend compila sem erros
- [ ] Acessando http://localhost:3000 (Docker) ou http://localhost:5173 (dev) mostra "Plataforma de Cursos"
- [ ] Data atual é exibida no formato DD/MM/AAAA
- [ ] Console do navegador não tem erros (F12 → Console)
- [ ] Página recarrega quando você salva mudanças (hot reload) - apenas em dev mode

### ✅ Código

- [ ] Código TypeScript compila sem erros (`npm run build`)
- [ ] Não há TODOs críticos deixados no código
- [ ] Commits seguem Conventional Commits

---

## Checkpoint: O que você deve conseguir explicar agora

Após completar este bloco, você deve conseguir explicar:

1. **Como React renderiza componentes:** Funções que retornam JSX são transformadas em HTML
2. **O que é JSX:** HTML dentro do JavaScript com interpolação
3. **Como Vite funciona:** Servidor de desenvolvimento rápido com HMR
4. **Estrutura básica de projeto React:** `src/` para código, `public/` para assets estáticos
5. **Como TypeScript ajuda:** Tipos previnem erros e melhoram autocomplete

## O que revisar se travar

Se você travar em algum ponto, revise:

- **Frontend não carrega:** Verifique logs (`docker-compose logs frontend`), veja se compilou sem erros, verifique porta
- **Não entende JSX:** Leia a seção "Conceitos explicados" novamente, pesquise "JSX React" no Google
- **TypeScript errors:** Verifique imports, verifique `tsconfig.json`, instale dependências faltantes

## Próximo bloco sugerido

**Bloco 2:** Primeira Entidade e CRUD Básico
- Criar entidade `Curso` (id, nome, descrição)
- Criar `CursoRepository` (Spring Data JPA)
- Criar `CursoController` com CRUD completo
- Frontend: listar cursos em uma tabela
- Aprender: JPA Entities, Repositories, DTOs, Validações

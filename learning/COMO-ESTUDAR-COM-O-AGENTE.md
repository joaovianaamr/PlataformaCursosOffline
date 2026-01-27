# Como Estudar com o Agente

Este documento explica como usar este projeto para aprender Java/Spring Boot e React/TypeScript de forma eficiente.

## 1. Como usar o projeto para aprender (rotina diária de 60–90 min)

### Rotina Recomendada

**Fase 1: Leitura (15-20 min)**
- Leia o documento do bloco atual (`BLOCO-N-*.md`)
- Foque na seção "Conceitos explicados"
- Anote dúvidas (não precisa resolver ainda)

**Fase 2: Execução (10-15 min)**
- Execute os comandos da seção "Como rodar e testar"
- Veja a aplicação funcionando
- Explore os endpoints no navegador/Postman

**Fase 3: Exploração do Código (20-30 min)**
- Abra os arquivos mencionados em "Arquivos importantes e por quê"
- Leia o código linha por linha
- Compare com Python quando fizer sentido
- Use o debugger do IDE para ver o fluxo

**Fase 4: Exercícios Práticos (20-30 min)**
- Faça os 3 exercícios propostos
- Teste cada mudança
- Se travar, consulte "Erros comuns e como diagnosticar"

**Fase 5: Revisão (5-10 min)**
- Revise o checklist de validação
- Confirme que entendeu cada conceito
- Anote o que precisa revisar depois

## 2. Método "ver -> rodar -> mudar -> quebrar -> consertar"

### Ver (Observar)
- Execute o código como está
- Veja o que acontece no console/logs
- Entenda o fluxo: requisição → processamento → resposta

### Rodar (Executar)
- Rode os testes manuais do checklist
- Teste endpoints com curl/Postman
- Navegue pela aplicação frontend

### Mudar (Modificar)
- Faça mudanças pequenas primeiro
- Exemplo: mude uma mensagem de texto
- Depois: adicione um novo campo
- Por fim: crie um novo endpoint

### Quebrar (Testar limites)
- Remova uma dependência e veja o erro
- Passe dados inválidos
- Teste casos extremos (null, vazio, muito grande)
- **Isso ensina como o sistema se comporta em erro**

### Consertar (Resolver)
- Leia a mensagem de erro completa
- Pesquise o erro no Stack Overflow
- Use o debugger para encontrar o problema
- Conserte e entenda POR QUE funcionou

## 3. Como revisar cada bloco (checklist do revisor)

Antes de avançar para o próximo bloco, responda:

- [ ] **Consigo explicar** o que cada arquivo principal faz?
- [ ] **Consigo rodar** a aplicação sem consultar a documentação?
- [ ] **Consigo modificar** algo simples (ex: mudar texto, adicionar campo)?
- [ ] **Consigo debugar** um erro básico usando logs/IDE?
- [ ] **Entendi** os conceitos principais (anotados no bloco)?
- [ ] **Completei** os 3 exercícios propostos?
- [ ] **Testei** todos os itens do checklist de validação?

Se faltar algum item, **NÃO avance**. Revise o bloco atual primeiro.

## 4. Como fazer perguntas úteis (exemplos)

### ❌ Perguntas Ruins (evite)
- "Não funciona" (muito vago)
- "Como faço tudo?" (muito amplo)
- "Me dá o código" (não aprende)

### ✅ Perguntas Boas (use como modelo)

**Sobre comportamento:**
- "Por que o Spring Boot retorna 404 quando acesso `/api/ping` sem o `/v1`?"
- "O que acontece se eu remover a anotação `@RestController`?"

**Sobre conceitos:**
- "Qual a diferença entre `@GetMapping` e `@RequestMapping(method = GET)`?"
- "Por que o React precisa de `useState` para atualizar a tela?"

**Sobre erros:**
- "Recebo erro 'BeanCreationException' ao iniciar. O que significa?"
- "O frontend não conecta com o backend. Como debugar CORS?"

**Sobre comparação:**
- "No Python eu usaria `if __name__ == '__main__'`. Como funciona no Spring Boot?"
- "No Flask eu retorno `jsonify()`. No Spring Boot é automático?"

## 5. Como registrar aprendizado (template rápido)

Crie um arquivo `MEU-DIARIO.md` na pasta `/learning` e use este template:

```markdown
## Bloco N - [Nome] - [Data]

### O que aprendi hoje
- Conceito 1: [explicação breve]
- Conceito 2: [explicação breve]

### Comparação com Python
- [Como fazia em Python] → [Como faz em Java/TS]

### Dúvidas resolvidas
- Dúvida: [pergunta]
- Resposta: [solução encontrada]

### Próxima sessão
- [ ] Revisar: [tópico]
- [ ] Praticar: [exercício]
- [ ] Explorar: [conceito novo]
```

## 6. Como evoluir do MVP para features avançadas (trilha)

### Nível 1: MVP Funcional (Blocos 1-3)
- Aplicação sobe e responde
- Endpoints básicos funcionando
- Frontend exibe dados

### Nível 2: CRUD Completo (Blocos 4-6)
- Criar, ler, atualizar, deletar
- Validações de entrada
- Tratamento de erros

### Nível 3: Autenticação (Blocos 7-9)
- Login/logout
- JWT tokens
- Proteção de rotas

### Nível 4: Features Avançadas (Blocos 10+)
- Upload de arquivos
- Streaming de vídeo
- Busca e filtros
- Cache e otimizações

**Regra de ouro:** Não pule níveis. Cada nível constrói sobre o anterior.

## 7. Como comparar com Python (ponte mental Python → Java/TS)

### Estrutura de Projeto

**Python (Flask/FastAPI):**
```
projeto/
  app.py          # Ponto de entrada
  requirements.txt
  .env
```

**Java (Spring Boot):**
```
projeto/
  src/main/java/com/empresa/app/
    Application.java    # Ponto de entrada (@SpringBootApplication)
  pom.xml              # requirements.txt
  application.yml      # .env + config
```

### Endpoints

**Python:**
```python
@app.get("/ping")
def ping():
    return {"status": "ok"}
```

**Java:**
```java
@GetMapping("/ping")
public Map<String, String> ping() {
    return Map.of("status", "ok");
}
```

### Variáveis de Ambiente

**Python:**
```python
import os
db_url = os.getenv("DATABASE_URL")
```

**Java:**
```yaml
# application.yml
spring:
  datasource:
    url: ${DATABASE_URL}
```

### Dependências

**Python:**
```txt
# requirements.txt
flask==2.0.0
sqlalchemy==1.4.0
```

**Java:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Componentes React vs Funções Python

**Python (retorna HTML):**
```python
def render_home():
    return f"<h1>Olá, {nome}</h1>"
```

**React (componente):**
```tsx
function Home({ nome }: { nome: string }) {
    return <h1>Olá, {nome}</h1>
}
```

## 8. Regras de ouro para não virar "copiador de código"

### ❌ NÃO Faça
1. **Copiar código sem ler**: Se não entendeu, não copie
2. **Pular explicações**: Leia os comentários e documentação
3. **Avançar sem testar**: Sempre teste antes de seguir
4. **Ignorar erros**: Erros são oportunidades de aprender

### ✅ FAÇA
1. **Leia antes de copiar**: Entenda o que cada linha faz
2. **Modifique depois**: Mude algo e veja o que acontece
3. **Explique em voz alta**: Se consegue explicar, entendeu
4. **Documente dúvidas**: Anote o que não entendeu para pesquisar depois

### Teste de Compreensão

Antes de copiar código, pergunte-se:
- **O que** este código faz?
- **Por que** está aqui?
- **Como** funciona passo a passo?
- **O que acontece** se eu mudar X?

Se não souber responder, **pare e pesquise primeiro**.

---

## Próximos Passos

1. Leia o documento `BLOCO-1-inicializacao-profissional.md`
2. Siga a rotina diária de 60-90 min
3. Use este guia como referência sempre que travar
4. Mantenha um diário de aprendizado

**Lembre-se:** O objetivo não é terminar rápido, mas **entender profundamente** cada conceito.

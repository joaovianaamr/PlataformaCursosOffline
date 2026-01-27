/**
 * Componente principal da aplicação.
 * 
 * Este é o componente raiz que será renderizado na tela.
 * No Bloco 1, apenas exibe o título da plataforma.
 * 
 * Analogia Python: É como uma função que retorna HTML:
 *   def render_home():
 *       return "<h1>Plataforma de Cursos</h1>"
 * 
 * Mas no React, quando os dados mudam, a tela atualiza automaticamente
 * (isso será explorado nos próximos blocos com useState).
 */
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Plataforma de Cursos</h1>
        <p>Bem-vindo à plataforma de cursos offline</p>
      </header>
    </div>
  )
}

export default App

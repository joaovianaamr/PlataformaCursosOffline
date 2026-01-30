function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Plataforma de Cursos</h1>
        <p>Bem-vindo à plataforma de cursos offline</p>
        <p>Data atual: {new Date().toLocaleDateString('pt-BR')}</p>
      </header>
    </div>
  )
}

export default App

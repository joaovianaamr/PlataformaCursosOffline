import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Ponto de entrada da aplicação React.
 * 
 * Este arquivo é o primeiro a ser executado quando a aplicação carrega.
 * Ele:
 * 1. Encontra o elemento <div id="root"> no HTML
 * 2. Renderiza o componente App dentro dele
 * 3. Conecta React ao DOM do navegador
 * 
 * Analogia Python: É como o "if __name__ == '__main__': app.run()" do Flask,
 * mas para o frontend - conecta React ao HTML.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

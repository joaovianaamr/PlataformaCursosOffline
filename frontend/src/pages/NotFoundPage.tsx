import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="font-mono text-sm text-text-muted">404</p>
      <h1 className="font-display text-2xl font-semibold text-text">Página não encontrada</h1>
      <p className="text-text-muted">O conteúdo que você procura não existe.</p>
      <Link to="/" className="mt-2 text-accent hover:text-accent-hover">
        ← Voltar ao catálogo
      </Link>
    </div>
  )
}

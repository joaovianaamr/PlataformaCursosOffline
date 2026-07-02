import { Link } from 'react-router-dom'

export function NavBar() {
  return (
    <header className="relative border-b border-border bg-surface">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
        <span className="flex h-8 w-6 shrink-0 items-center justify-center rounded-[2px] bg-accent text-xs font-bold text-bg shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
          PC
        </span>
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            Plataforma de Cursos
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
            biblioteca offline
          </span>
        </Link>
      </div>
    </header>
  )
}

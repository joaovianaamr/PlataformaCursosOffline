export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">carregando</p>
    </div>
  )
}

interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = 'Não foi possível carregar os dados.' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface py-16 text-center">
      <span className="font-mono text-2xl text-accent">!</span>
      <p className="text-text">{message}</p>
      <p className="text-sm text-text-muted">Verifique se o servidor está disponível e tente novamente.</p>
    </div>
  )
}

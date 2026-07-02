interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({ title = 'Conteúdo em breve', message = 'Este módulo ainda não tem aulas disponíveis.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface py-16 text-center">
      <p className="font-display text-lg font-medium text-text">{title}</p>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}

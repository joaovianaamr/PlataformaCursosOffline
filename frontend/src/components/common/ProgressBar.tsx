interface ProgressBarProps {
  percent: number
}

export function ProgressBar({ percent }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useBreadcrumbTrail } from '@/hooks/useBreadcrumbTrail'

export function Breadcrumb() {
  const segments = useBreadcrumbTrail()
  if (segments.length === 0) return null

  return (
    <nav aria-label="breadcrumb" className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 py-3 font-mono text-xs uppercase tracking-wide text-text-muted sm:px-6">
        {segments.map((segment, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-text-muted/50">/</span>}
            {segment.to ? (
              <Link to={segment.to} className="max-w-[16rem] truncate text-accent hover:text-accent-hover">
                {segment.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[16rem] truncate text-text">
                {segment.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}

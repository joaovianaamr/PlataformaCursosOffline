import { Link } from 'react-router-dom'
import type { ModuleSummary } from '@/types/course'

interface ModuleListProps {
  basePath: string
  modules: ModuleSummary[]
}

export function ModuleList({ basePath, modules }: ModuleListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
      {modules.map((module, index) => (
        <li key={module.slug} className="relative">
          <Link
            to={`${basePath}/${module.slug}`}
            className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover"
          >
            <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="w-7 shrink-0 text-right font-mono text-sm text-text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-medium text-text">{module.title}</p>
              {module.description && (
                <p className="truncate text-sm text-text-muted">{module.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!module.hasContent ? (
                <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted">
                  Em breve
                </span>
              ) : !module.hasChildren ? (
                <span className="font-mono text-xs text-text-muted">
                  {module.lessonCount} {module.lessonCount === 1 ? 'aula' : 'aulas'}
                </span>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

import { Link } from 'react-router-dom'
import type { Material } from '@/types/course'
import { buildMaterialUrl } from '@/services/media'

interface MaterialsListProps {
  materials: Material[]
}

export function MaterialsList({ materials }: MaterialsListProps) {
  if (materials.length === 0) return null

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Materiais</h2>
      <ul className="flex flex-wrap gap-2">
        {materials.map((material) => {
          const isExternal = material.type === 'LINK'
          const href = isExternal ? material.url! : buildMaterialUrl(material.fileUrl!)
          return (
            <li key={material.slug} className="flex items-center gap-1.5">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-bg px-3 py-1.5 text-sm text-text transition-colors hover:border-accent/50 hover:text-accent"
              >
                <span aria-hidden className="text-text-muted">
                  {isExternal ? '↗' : '▤'}
                </span>
                {material.title}
              </a>
              {!isExternal && material.fileUrl && (
                <Link
                  to={`/quadro?fileUrl=${encodeURIComponent(material.fileUrl)}&title=${encodeURIComponent(material.title)}`}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-bg px-3 py-1.5 text-sm text-text transition-colors hover:border-accent/50 hover:text-accent"
                  title="Abrir no quadro para desenhar por cima"
                >
                  <span aria-hidden className="text-text-muted">✎</span>
                  Quadro
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import { Link } from 'react-router-dom'
import type { Material } from '@/types/course'
import { buildMaterialUrl } from '@/services/media'

interface MaterialsListProps {
  materials: Material[]
}

// Links do Drive (Exercícios/Gabarito hospedados lá em vez de localmente) também
// dão pra abrir no quadro — só não dá pra saber isso a partir do `type`, que é
// sempre 'LINK' tanto pra esses quanto pra referências de verdade (artigos, vídeos).
// O pdf.js não consegue buscar o PDF direto do Drive (CORS quebra no redirect),
// então passa pelo proxy do backend, que baixa o arquivo por trás.
const DRIVE_ID_PATTERN = /drive\.google\.com\/(?:uc\?(?:.*&)?id=|file\/d\/)([\w-]+)/i

function toAnnotatablePdfUrl(url: string): string | null {
  const driveId = url.match(DRIVE_ID_PATTERN)?.[1]
  return driveId ? `/api/v1/media/external-pdf?driveId=${driveId}` : null
}

export function MaterialsList({ materials }: MaterialsListProps) {
  if (materials.length === 0) return null

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Materiais</h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {materials.map((material) => {
          const isExternal = material.type === 'LINK'
          const href = isExternal ? material.url! : buildMaterialUrl(material.fileUrl!)
          const quadroFileUrl = isExternal
            ? material.url && toAnnotatablePdfUrl(material.url)
            : material.fileUrl
          return (
            <li key={material.slug} className="flex items-center gap-1.5">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-sm border border-border bg-bg px-3 py-1.5 text-sm text-text transition-colors hover:border-accent/50 hover:text-accent"
              >
                <span aria-hidden className="text-text-muted">
                  {isExternal ? '↗' : '▤'}
                </span>
                <span className="truncate">{material.title}</span>
              </a>
              {quadroFileUrl && (
                <Link
                  to={`/quadro?fileUrl=${encodeURIComponent(quadroFileUrl)}&title=${encodeURIComponent(material.title)}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-bg px-3 py-1.5 text-sm text-text transition-colors hover:border-accent/50 hover:text-accent"
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

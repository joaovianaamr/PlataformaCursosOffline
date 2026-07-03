import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson, Material } from '@/types/course'
import { useProgress } from '@/hooks/useProgress'
import { chapterProgressKey } from '@/lib/progress'
import { formatTimestamp } from '@/lib/formatTimestamp'
import { MaterialsList } from '@/components/lesson/MaterialsList'
import { EmptyState } from '@/components/common/EmptyState'

interface CorteListSectionProps {
  courseSlug: string
  modulePath: string[]
  lessons: Lesson[]
  materials: Material[]
}

/**
 * Lista os cortes (tópicos) de todas as aulas do módulo direto, sem passar
 * pela aula-inteira como um passo de navegação: a aula vira apenas um
 * rótulo de seção agrupando seus cortes, que são o alvo de clique.
 * Aulas sem capítulos aparecem como uma única linha (o vídeo inteiro).
 */
export function CorteListSection({ courseSlug, modulePath, lessons, materials }: CorteListSectionProps) {
  const { isWatched } = useProgress()

  if (lessons.length === 0) {
    return <EmptyState />
  }

  const aulasBasePath = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}/aulas`
  let corteNumber = 0

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
        {lessons.map((lesson) => {
          if (lesson.chapters.length === 0) {
            corteNumber += 1
            const watched = isWatched(lesson.slug)
            return (
              <li key={lesson.slug} className="relative">
                <Link
                  to={`${aulasBasePath}/${lesson.slug}`}
                  className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover"
                >
                  <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className={`w-9 shrink-0 text-right font-mono text-sm ${watched ? 'text-success' : 'text-text-muted'}`}>
                    {watched ? '✓' : String(corteNumber).padStart(3, '0')}
                  </span>
                  <span className="min-w-0 flex-1 text-text">{lesson.title}</span>
                </Link>
              </li>
            )
          }

          return (
            <Fragment key={lesson.slug}>
              <li className="bg-bg/40 px-4 py-2">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {lesson.title}
                </p>
              </li>
              {lesson.chapters.map((chapter) => {
                corteNumber += 1
                const watched = isWatched(chapterProgressKey(lesson.slug, chapter.order))
                return (
                  <li key={`${lesson.slug}-${chapter.order}`} className="relative">
                    <Link
                      to={`${aulasBasePath}/${lesson.slug}/cortes/${chapter.order}`}
                      className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover"
                    >
                      <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className={`w-9 shrink-0 text-right font-mono text-sm ${watched ? 'text-success' : 'text-text-muted'}`}>
                        {watched ? '✓' : String(corteNumber).padStart(3, '0')}
                      </span>
                      <span className="min-w-0 flex-1 text-text">{chapter.title}</span>
                      <span className="shrink-0 font-mono text-xs text-text-muted">{formatTimestamp(chapter.startSeconds)}</span>
                    </Link>
                  </li>
                )
              })}
            </Fragment>
          )
        })}
      </ul>

      <MaterialsList materials={materials} />
    </div>
  )
}

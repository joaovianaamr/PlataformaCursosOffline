import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Chapter, Lesson, Material } from '@/types/course'
import { useProgress } from '@/hooks/useProgress'
import { chapterProgressKey } from '@/lib/progress'
import { formatTimestamp } from '@/lib/formatTimestamp'
import { extractShortTitle } from '@/lib/shortTitle'
import { MaterialsList } from '@/components/lesson/MaterialsList'
import { EmptyState } from '@/components/common/EmptyState'

interface CorteListSectionProps {
  courseSlug: string
  modulePath: string[]
  lessons: Lesson[]
  materials: Material[]
}

interface LessonRow {
  lesson: Lesson
  corteNumber: number
  chapterNumbers: Map<number, number>
}

/** Numeração corrida sobre os dados completos, independente do que está expandido. */
function buildLessonRows(lessons: Lesson[]): LessonRow[] {
  let corteNumber = 0
  return lessons.map((lesson) => {
    if (lesson.chapters.length === 0) {
      corteNumber += 1
      return { lesson, corteNumber, chapterNumbers: new Map() }
    }
    const chapterNumbers = new Map<number, number>()
    for (const chapter of lesson.chapters) {
      corteNumber += 1
      chapterNumbers.set(chapter.order, corteNumber)
    }
    return { lesson, corteNumber: -1, chapterNumbers }
  })
}

/**
 * Lista os cortes (tópicos) de todas as aulas do módulo direto, sem passar
 * pela aula-inteira como um passo de navegação: a aula vira apenas um
 * cabeçalho retrátil agrupando seus cortes, que são o alvo de clique.
 * Aulas sem capítulos aparecem como uma única linha (o vídeo inteiro).
 */
export function CorteListSection({ courseSlug, modulePath, lessons, materials }: CorteListSectionProps) {
  const { isWatched } = useProgress()
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set())

  if (lessons.length === 0) {
    return <EmptyState />
  }

  const toggleLesson = (lessonSlug: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev)
      if (next.has(lessonSlug)) {
        next.delete(lessonSlug)
      } else {
        next.add(lessonSlug)
      }
      return next
    })
  }

  const aulasBasePath = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}/aulas`
  const rows = buildLessonRows(lessons)

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
        {rows.map(({ lesson, corteNumber, chapterNumbers }) => {
          if (lesson.chapters.length === 0) {
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

          const expanded = expandedLessons.has(lesson.slug)

          return (
            <Fragment key={lesson.slug}>
              <li>
                <button
                  type="button"
                  onClick={() => toggleLesson(lesson.slug)}
                  className="group flex w-full items-center gap-4 bg-bg/40 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <span className="w-9 shrink-0 text-right font-mono text-sm text-accent">
                    {String(lesson.order).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
                    {extractShortTitle(lesson.title)}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {lesson.chapters.length} {lesson.chapters.length === 1 ? 'corte' : 'cortes'}
                  </span>
                  <span className="shrink-0 text-text-muted">{expanded ? '▾' : '▸'}</span>
                </button>
              </li>
              {expanded &&
                lesson.chapters.map((chapter: Chapter) => {
                  const watched = isWatched(chapterProgressKey(lesson.slug, chapter.order))
                  return (
                    <li key={`${lesson.slug}-${chapter.order}`} className="relative">
                      <Link
                        to={`${aulasBasePath}/${lesson.slug}/cortes/${chapter.order}`}
                        className="group flex items-center gap-4 px-4 py-3.5 pl-8 transition-colors hover:bg-surface-hover"
                      >
                        <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                        <span className={`w-9 shrink-0 text-right font-mono text-sm ${watched ? 'text-success' : 'text-text-muted'}`}>
                          {watched ? '✓' : String(chapterNumbers.get(chapter.order)).padStart(3, '0')}
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

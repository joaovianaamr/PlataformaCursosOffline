import { Link } from 'react-router-dom'
import type { Lesson, Material } from '@/types/course'
import { useProgress } from '@/hooks/useProgress'
import { MaterialsList } from '@/components/lesson/MaterialsList'
import { EmptyState } from '@/components/common/EmptyState'

interface LessonListSectionProps {
  courseSlug: string
  modulePath: string[]
  lessons: Lesson[]
  materials: Material[]
}

export function LessonListSection({ courseSlug, modulePath, lessons, materials }: LessonListSectionProps) {
  const { isWatched } = useProgress()

  if (lessons.length === 0) {
    return <EmptyState />
  }

  const basePath = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}/aulas`

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
        {lessons.map((lesson) => {
          const watched = isWatched(lesson.slug)
          return (
            <li key={lesson.slug} className="relative">
              <Link
                to={`${basePath}/${lesson.slug}`}
                className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover"
              >
                <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                <span
                  className={`w-7 shrink-0 text-right font-mono text-sm ${watched ? 'text-success' : 'text-text-muted'}`}
                >
                  {watched ? '✓' : String(lesson.order).padStart(2, '0')}
                </span>
                <span className="text-text">{lesson.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <MaterialsList materials={materials} />
    </div>
  )
}

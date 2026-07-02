import { Link } from 'react-router-dom'
import type { Lesson } from '@/types/course'

interface LessonSidebarProps {
  courseSlug: string
  modulePath: string[]
  lessons: Lesson[]
  activeLessonSlug: string
  isWatched: (lessonSlug: string) => boolean
}

export function LessonSidebar({ courseSlug, modulePath, lessons, activeLessonSlug, isWatched }: LessonSidebarProps) {
  const basePath = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}/aulas`

  return (
    <nav className="flex flex-col gap-1 rounded-md border border-border bg-surface p-2">
      <p className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        Nesta aula
      </p>
      {lessons.map((lesson) => {
        const active = lesson.slug === activeLessonSlug
        const watched = isWatched(lesson.slug)
        return (
          <Link
            key={lesson.slug}
            to={`${basePath}/${lesson.slug}`}
            className={`relative flex items-center gap-2 rounded-sm px-3 py-2 pl-4 text-sm transition-colors ${
              active ? 'bg-accent/15 text-text' : 'text-text-muted hover:bg-surface-hover hover:text-text'
            }`}
          >
            {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />}
            <span className={`font-mono text-xs ${watched ? 'text-success' : active ? 'text-accent' : 'text-text-muted'}`}>
              {watched ? '✓' : String(lesson.order).padStart(2, '0')}
            </span>
            <span className="line-clamp-2">{lesson.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

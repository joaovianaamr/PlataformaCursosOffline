import { Link } from 'react-router-dom'
import type { CourseSummary } from '@/types/course'
import { CoursePlaceholderCover } from './CoursePlaceholderCover'

interface CourseCardProps {
  course: CourseSummary
  index: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <Link
      to={`/cursos/${course.slug}`}
      className="group relative flex overflow-hidden rounded-md border border-border bg-surface shadow-[0_1px_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="w-2 shrink-0 bg-gradient-to-b from-accent to-accent/60" />
      <div className="flex flex-1 flex-col">
        <div className="relative">
          {course.coverImage ? (
            <img
              src={`/covers/${course.coverImage}`}
              alt={course.title}
              className="aspect-video w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <CoursePlaceholderCover slug={course.slug} title={course.title} />
          )}
          <span className="absolute bottom-0 left-0 border border-b-0 border-l-0 border-border bg-bg/85 px-2 py-1 font-mono text-xs text-accent">
            Nº {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-text">{course.title}</h3>
            {!course.hasContent && (
              <span className="shrink-0 rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted">
                Em breve
              </span>
            )}
          </div>
          {course.description && (
            <p className="line-clamp-2 text-sm text-text-muted">{course.description}</p>
          )}
          <p className="mt-auto pt-1 font-mono text-xs text-text-muted">
            {String(course.moduleCount).padStart(2, '0')} {course.moduleCount === 1 ? 'módulo' : 'módulos'}
          </p>
        </div>
      </div>
    </Link>
  )
}

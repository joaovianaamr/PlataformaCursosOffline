import { useParams } from 'react-router-dom'
import { useCourseDetail } from '@/hooks/useCourseDetail'
import { ModuleList } from '@/components/course/ModuleList'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'

export function CourseDetailPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { data: course, isLoading, isError } = useCourseDetail(courseSlug)

  if (isLoading) return <Spinner />
  if (isError || !course) return <ErrorState message="Não foi possível carregar este curso." />

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Curso</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          {course.title}
        </h1>
        {course.description && <p className="mt-2 max-w-2xl text-text-muted">{course.description}</p>}
      </div>
      <div>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Índice</h2>
        <ModuleList basePath={`/cursos/${course.slug}/modulos`} modules={course.modules} />
      </div>
    </div>
  )
}

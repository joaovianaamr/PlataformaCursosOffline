import { useMemo, useState } from 'react'
import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from '@/components/catalog/CourseCard'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'

export function CatalogPage() {
  const { data: courses, isLoading, isError } = useCourses()
  const [search, setSearch] = useState('')

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    const query = search.trim().toLowerCase()
    if (!query) return courses
    return courses.filter((course) => course.title.toLowerCase().includes(query))
  }, [courses, search])

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState message="Não foi possível carregar o catálogo de cursos." />

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Estante</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Catálogo de cursos
          </h1>
          <p className="mt-1 text-text-muted">Escolha um curso na sua estante para continuar estudando.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-mono text-sm text-text-muted">
            /
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="buscar curso..."
            aria-label="Buscar curso"
            className="w-full rounded-md border border-border bg-surface py-2 pl-7 pr-3 text-sm text-text placeholder:text-text-muted/70 focus:border-accent"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <CourseCard key={course.slug} course={course} index={index} />
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <p className="py-8 text-center text-text-muted">
          Nenhum curso encontrado para <span className="font-mono text-text">"{search}"</span>.
        </p>
      )}
    </div>
  )
}

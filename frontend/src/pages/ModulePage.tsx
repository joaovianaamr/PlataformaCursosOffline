import { useParams } from 'react-router-dom'
import { useModuleDetail } from '@/hooks/useModuleDetail'
import { ModuleList } from '@/components/course/ModuleList'
import { CorteListSection } from '@/components/course/CorteListSection'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'

export function ModulePage() {
  const { courseSlug, m1, m2 } = useParams<{ courseSlug: string; m1: string; m2?: string }>()
  const modulePath = [m1, m2].filter((v): v is string => Boolean(v))
  const { data: module, isLoading, isError } = useModuleDetail(courseSlug, modulePath)

  if (isLoading) return <Spinner />
  if (isError || !module) return <ErrorState message="Não foi possível carregar este módulo." />

  const basePath = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}`

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Módulo</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          {module.title}
        </h1>
        {module.description && <p className="mt-2 max-w-2xl text-text-muted">{module.description}</p>}
      </div>

      {module.children.length > 0 ? (
        <ModuleList basePath={basePath} modules={module.children} />
      ) : (
        <CorteListSection
          courseSlug={courseSlug!}
          modulePath={modulePath}
          lessons={module.lessons}
          materials={module.materials}
        />
      )}
    </div>
  )
}

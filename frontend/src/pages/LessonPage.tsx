import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useModuleDetail } from '@/hooks/useModuleDetail'
import { useProgress } from '@/hooks/useProgress'
import { VideoPlayer } from '@/components/lesson/VideoPlayer'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { MaterialsList } from '@/components/lesson/MaterialsList'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'

export function LessonPage() {
  const { courseSlug, m1, m2, lessonSlug } = useParams<{
    courseSlug: string
    m1: string
    m2?: string
    lessonSlug: string
  }>()
  const modulePath = [m1, m2].filter((v): v is string => Boolean(v))
  const navigate = useNavigate()
  const { data: module, isLoading, isError } = useModuleDetail(courseSlug, modulePath)
  const { isWatched, getPosition, updateProgress, markWatched } = useProgress()

  if (isLoading) return <Spinner />
  if (isError || !module) return <ErrorState message="Não foi possível carregar esta aula." />

  const lessonIndex = module.lessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = module.lessons[lessonIndex]

  if (!lesson) return <ErrorState message="Aula não encontrada neste módulo." />

  const modulePathUrl = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}`
  const lessonPathUrl = `${modulePathUrl}/aulas/${lesson.slug}`

  // O módulo já lista os cortes direto; um link solto para a aula-pasta
  // pula direto para o primeiro corte em vez de mostrar um passo intermediário.
  if (lesson.chapters.length > 0) {
    return <Navigate to={`${lessonPathUrl}/cortes/${lesson.chapters[0].order}`} replace />
  }

  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null

  const goTo = (targetSlug: string) => {
    navigate(`${modulePathUrl}/aulas/${targetSlug}`)
  }

  // Num módulo que já usa cortes (ex.: Química), uma aula solta sem capítulos
  // é a exceção — não faz sentido colar a lista gigante de todas as outras
  // aulas do módulo do lado. Em um módulo sem cortes (ex.: Física), onde cada
  // aula é mesmo um arquivo separado dentro da pasta, essa lista É a
  // navegação principal e continua fazendo sentido mostrar.
  const moduleUsesCortes = module.lessons.some((l) => l.chapters.length > 0)

  const player = (
    <div className="flex flex-col gap-4">
      <VideoPlayer
        key={lesson.slug}
        lessonSlug={lesson.slug}
        videoUrl={lesson.videoUrl}
        initialPositionSeconds={getPosition(lesson.slug)}
        chapters={lesson.chapters}
        onProgress={(position, watched) => updateProgress(lesson.slug, position, watched)}
        onEnded={() => markWatched(lesson.slug)}
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!prevLesson}
          onClick={() => prevLesson && goTo(prevLesson.slug)}
          className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-text disabled:opacity-30 enabled:hover:border-accent/50 enabled:hover:bg-surface-hover"
        >
          ← anterior
        </button>
        <button
          type="button"
          disabled={!nextLesson}
          onClick={() => nextLesson && goTo(nextLesson.slug)}
          className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-text disabled:opacity-30 enabled:hover:border-accent/50 enabled:hover:bg-surface-hover"
        >
          próxima →
        </button>
      </div>

      <MaterialsList materials={lesson.materials} />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {lesson.title}
        </h1>
      </div>

      {moduleUsesCortes ? (
        <div className="mx-auto w-full max-w-3xl">{player}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          {player}
          <LessonSidebar
            courseSlug={courseSlug!}
            modulePath={modulePath}
            lessons={module.lessons}
            activeLessonSlug={lesson.slug}
            isWatched={isWatched}
          />
        </div>
      )}
    </div>
  )
}

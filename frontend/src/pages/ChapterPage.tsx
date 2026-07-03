import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useModuleDetail } from '@/hooks/useModuleDetail'
import { useProgress } from '@/hooks/useProgress'
import { VideoPlayer, type VideoPlayerHandle } from '@/components/lesson/VideoPlayer'
import { ChapterList } from '@/components/lesson/ChapterList'
import { MaterialsList } from '@/components/lesson/MaterialsList'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'
import { chapterProgressKey } from '@/lib/progress'
import type { Chapter } from '@/types/course'

export function ChapterPage() {
  const { courseSlug, m1, m2, lessonSlug, chapterSlug } = useParams<{
    courseSlug: string
    m1: string
    m2?: string
    lessonSlug: string
    chapterSlug: string
  }>()
  const modulePath = [m1, m2].filter((v): v is string => Boolean(v))
  const navigate = useNavigate()
  const { data: module, isLoading, isError } = useModuleDetail(courseSlug, modulePath)
  const { isWatched, updateProgress, markWatched } = useProgress()
  const playerRef = useRef<VideoPlayerHandle>(null)
  const isFirstRender = useRef(true)

  const lesson = module?.lessons.find((l) => l.slug === lessonSlug)
  const chapterIndex = lesson ? lesson.chapters.findIndex((c) => c.slug === chapterSlug) : -1
  const chapter = lesson?.chapters[chapterIndex]

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (chapter) {
      playerRef.current?.seekTo(chapter.startSeconds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSlug])

  if (isLoading) return <Spinner />
  if (isError || !module) return <ErrorState message="Não foi possível carregar esta aula." />
  if (!lesson) return <ErrorState message="Aula não encontrada neste módulo." />
  if (!chapter) return <ErrorState message="Corte não encontrado nesta aula." />

  const modulePathUrl = `/cursos/${courseSlug}/modulos/${modulePath.join('/')}`
  const lessonPathUrl = `${modulePathUrl}/aulas/${lesson.slug}`
  const cortesBasePath = `${lessonPathUrl}/cortes`

  const prevChapter = chapterIndex > 0 ? lesson.chapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex < lesson.chapters.length - 1 ? lesson.chapters[chapterIndex + 1] : null

  const goToChapter = (target: Chapter) => {
    navigate(`${cortesBasePath}/${target.slug}`)
  }

  const handleChapterWatched = (watchedChapterSlug: string) => {
    markWatched(chapterProgressKey(lesson.slug, watchedChapterSlug))
    const allWatched = lesson.chapters.every(
      (c) => c.slug === watchedChapterSlug || isWatched(chapterProgressKey(lesson.slug, c.slug)),
    )
    if (allWatched) {
      markWatched(lesson.slug)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to={lessonPathUrl}
          className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover"
        >
          ← voltar à aula
        </Link>
        <p className="mt-1 truncate text-sm text-text-muted">{lesson.title}</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {chapter.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <VideoPlayer
            ref={playerRef}
            key={lesson.slug}
            lessonSlug={lesson.slug}
            videoUrl={lesson.videoUrl}
            initialPositionSeconds={chapter.startSeconds}
            chapters={lesson.chapters}
            onProgress={(position, watched) => updateProgress(lesson.slug, position, watched)}
            onEnded={() => markWatched(lesson.slug)}
            onChapterWatched={handleChapterWatched}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={!prevChapter}
              onClick={() => prevChapter && goToChapter(prevChapter)}
              className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-text disabled:opacity-30 enabled:hover:border-accent/50 enabled:hover:bg-surface-hover"
            >
              ← corte anterior
            </button>
            <button
              type="button"
              disabled={!nextChapter}
              onClick={() => nextChapter && goToChapter(nextChapter)}
              className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-text disabled:opacity-30 enabled:hover:border-accent/50 enabled:hover:bg-surface-hover"
            >
              próximo corte →
            </button>
          </div>

          <MaterialsList materials={lesson.materials} />
        </div>

        <ChapterList
          chapters={lesson.chapters}
          activeChapterSlug={chapter.slug}
          isChapterWatched={(cs) => isWatched(chapterProgressKey(lesson.slug, cs))}
          onSelect={goToChapter}
        />
      </div>
    </div>
  )
}

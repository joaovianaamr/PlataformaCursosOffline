import { useParams } from 'react-router-dom'
import { useCourseDetail } from './useCourseDetail'
import { useModuleDetail } from './useModuleDetail'

export interface BreadcrumbSegment {
  label: string
  to: string | null
}

export function useBreadcrumbTrail(): BreadcrumbSegment[] {
  const { courseSlug, m1, m2, lessonSlug, chapterOrder } = useParams<{
    courseSlug?: string
    m1?: string
    m2?: string
    lessonSlug?: string
    chapterOrder?: string
  }>()

  const modulePath = [m1, m2].filter((v): v is string => Boolean(v))
  const { data: course } = useCourseDetail(courseSlug)
  const { data: module } = useModuleDetail(courseSlug, modulePath.length > 0 ? modulePath : undefined)

  if (!courseSlug) return []

  const segments: BreadcrumbSegment[] = []
  segments.push({ label: course?.title ?? courseSlug, to: `/cursos/${courseSlug}` })

  if (m1) {
    const m1Title = course?.modules.find((m) => m.slug === m1)?.title ?? m1
    segments.push({ label: m1Title, to: `/cursos/${courseSlug}/modulos/${m1}` })
  }

  if (m2) {
    segments.push({ label: module?.title ?? m2, to: `/cursos/${courseSlug}/modulos/${m1}/${m2}` })
  }

  if (lessonSlug) {
    const lesson = module?.lessons.find((l) => l.slug === lessonSlug)
    segments.push({
      label: lesson?.title ?? lessonSlug,
      to: `/cursos/${courseSlug}/modulos/${modulePath.join('/')}/aulas/${lessonSlug}`,
    })
  }

  if (chapterOrder) {
    const lesson = module?.lessons.find((l) => l.slug === lessonSlug)
    const chapter = lesson?.chapters.find((c) => String(c.order) === chapterOrder)
    segments.push({ label: chapter?.title ?? `Corte ${chapterOrder}`, to: null })
  }

  segments[segments.length - 1] = { ...segments[segments.length - 1], to: null }
  return segments
}

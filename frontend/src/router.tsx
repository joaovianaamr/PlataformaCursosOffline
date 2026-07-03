import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { CatalogPage } from '@/pages/CatalogPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { ModulePage } from '@/pages/ModulePage'
import { LessonPage } from '@/pages/LessonPage'
import { ChapterPage } from '@/pages/ChapterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'cursos/:courseSlug', element: <CourseDetailPage /> },
      { path: 'cursos/:courseSlug/modulos/:m1', element: <ModulePage /> },
      { path: 'cursos/:courseSlug/modulos/:m1/:m2', element: <ModulePage /> },
      { path: 'cursos/:courseSlug/modulos/:m1/aulas/:lessonSlug', element: <LessonPage /> },
      { path: 'cursos/:courseSlug/modulos/:m1/:m2/aulas/:lessonSlug', element: <LessonPage /> },
      { path: 'cursos/:courseSlug/modulos/:m1/aulas/:lessonSlug/cortes/:chapterSlug', element: <ChapterPage /> },
      { path: 'cursos/:courseSlug/modulos/:m1/:m2/aulas/:lessonSlug/cortes/:chapterSlug', element: <ChapterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

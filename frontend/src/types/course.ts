export interface CourseSummary {
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  moduleCount: number
  hasContent: boolean
}

export interface ModuleSummary {
  slug: string
  title: string
  description: string | null
  lessonCount: number
  hasChildren: boolean
  hasContent: boolean
}

export interface CourseDetail {
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  modules: ModuleSummary[]
}

export type MaterialType = 'TEORIA' | 'EXERCICIOS' | 'LINK' | 'OTHER'

export interface Chapter {
  slug: string
  order: number
  title: string
  startSeconds: number
  endSeconds: number
}

export interface Lesson {
  slug: string
  order: number
  title: string
  videoUrl: string
  chapters: Chapter[]
}

export interface Material {
  slug: string
  title: string
  type: MaterialType
  fileUrl: string | null
  url: string | null
}

export interface ModuleDetail {
  slug: string
  title: string
  description: string | null
  lessons: Lesson[]
  materials: Material[]
  children: ModuleSummary[]
}

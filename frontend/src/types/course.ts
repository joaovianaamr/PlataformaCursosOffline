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

export type MaterialType = 'TEORIA' | 'EXERCICIOS' | 'OTHER'

export interface Lesson {
  slug: string
  order: number
  title: string
  videoUrl: string
}

export interface Material {
  slug: string
  title: string
  type: MaterialType
  fileUrl: string
}

export interface ModuleDetail {
  slug: string
  title: string
  description: string | null
  lessons: Lesson[]
  materials: Material[]
  children: ModuleSummary[]
}

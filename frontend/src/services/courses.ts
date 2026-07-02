import { api } from './api'
import type { CourseDetail, CourseSummary, ModuleDetail } from '@/types/course'

export async function getCourses(): Promise<CourseSummary[]> {
  const { data } = await api.get<CourseSummary[]>('/courses')
  return data
}

export async function getCourseDetail(courseSlug: string): Promise<CourseDetail> {
  const { data } = await api.get<CourseDetail>(`/courses/${courseSlug}`)
  return data
}

export async function getModuleDetail(courseSlug: string, modulePath: string[]): Promise<ModuleDetail> {
  const { data } = await api.get<ModuleDetail>(`/courses/${courseSlug}/modules/${modulePath.join('/')}`)
  return data
}

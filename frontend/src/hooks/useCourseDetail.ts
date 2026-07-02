import { useQuery } from '@tanstack/react-query'
import { getCourseDetail } from '@/services/courses'

export function useCourseDetail(courseSlug: string | undefined) {
  return useQuery({
    queryKey: ['course', courseSlug],
    queryFn: () => getCourseDetail(courseSlug!),
    enabled: Boolean(courseSlug),
  })
}

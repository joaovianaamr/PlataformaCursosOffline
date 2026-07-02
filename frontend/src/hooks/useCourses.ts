import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/courses'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
}

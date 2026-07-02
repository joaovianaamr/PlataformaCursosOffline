import { useQuery } from '@tanstack/react-query'
import { getModuleDetail } from '@/services/courses'

export function useModuleDetail(courseSlug: string | undefined, modulePath: string[] | undefined) {
  return useQuery({
    queryKey: ['module', courseSlug, ...(modulePath ?? [])],
    queryFn: () => getModuleDetail(courseSlug!, modulePath!),
    enabled: Boolean(courseSlug) && Boolean(modulePath) && (modulePath?.length ?? 0) > 0,
  })
}

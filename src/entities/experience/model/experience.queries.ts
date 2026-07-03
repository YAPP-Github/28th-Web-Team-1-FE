'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { experienceQueries } from './experience.keys'

export const useExperienceList = (workspaceId?: string) => {
  const { data, ...rest } = useInfiniteQuery({
    ...experienceQueries.list(workspaceId ?? ''),
    enabled: Boolean(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data ?? [], ...rest }
}

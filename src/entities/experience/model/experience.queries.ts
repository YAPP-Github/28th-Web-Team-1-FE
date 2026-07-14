'use client'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { experienceQueries } from './experience.keys'

export const useExperienceList = (workspaceId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

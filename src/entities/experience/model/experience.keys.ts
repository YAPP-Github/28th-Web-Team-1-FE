import { infiniteQueryOptions } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'

export const experienceKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...experienceKeys.lists(), workspaceId] as const
}

export const experienceQueries = {
  list: (workspaceId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.list(workspaceId),
      queryFn: ({ pageParam }) => experienceAPI.getExperiences({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    })
}

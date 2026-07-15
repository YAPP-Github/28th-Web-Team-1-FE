import { infiniteQueryOptions } from '@tanstack/react-query'
import { projectAPI } from '../api/project.api'

export const projectKeys = {
  all: ['project'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  filterOptions: (workspaceId: string) => [...projectKeys.lists(), 'filter-options', workspaceId] as const
}

export const projectQueries = {
  filterOptions: (workspaceId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: projectKeys.filterOptions(workspaceId),
      queryFn: ({ pageParam }) => projectAPI.getProjectFilterOptions({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experienceProjects.cursor.hasNext ? lastPage.experienceProjects.cursor.nextCursor : null)
    })
}

import { infiniteQueryOptions } from '@tanstack/react-query'
import { projectAPI } from '../api/project.api'

export const projectKeys = {
  all: ['project'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  filterOptions: (workspaceId: string) => [...projectKeys.lists(), 'filter-options', workspaceId] as const
}

export const projectQueries = {
  /** 경험정리 메인 페이지의 프로젝트 목록을 커서 기반으로 조회한다. */
  list: (workspaceId: string, size = 10) =>
    infiniteQueryOptions({
      queryKey: projectKeys.list(workspaceId),
      queryFn: ({ pageParam }) => projectAPI.getProjects({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.projectList.cursor.hasNext ? lastPage.projectList.cursor.nextCursor : null)
    }),
  filterOptions: (workspaceId: string, size = 10) =>
    infiniteQueryOptions({
      queryKey: projectKeys.filterOptions(workspaceId),
      queryFn: ({ pageParam }) => projectAPI.getProjectFilterOptions({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experienceProjects.cursor.hasNext ? lastPage.experienceProjects.cursor.nextCursor : null)
    })
}

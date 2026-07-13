import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'

export const experienceKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...experienceKeys.lists(), workspaceId] as const,
  projects: () => [...experienceKeys.all, 'project'] as const,
  projectList: (workspaceId: string) => [...experienceKeys.projects(), 'list', workspaceId] as const,
  searches: () => [...experienceKeys.all, 'search'] as const,
  search: (workspaceId: string, keyword: string) => [...experienceKeys.searches(), workspaceId, keyword] as const
}

export const experienceQueries = {
  /** 경험정리 메인 페이지의 경험 목록을 커서 기반으로 조회한다. */
  list: (workspaceId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.list(workspaceId),
      queryFn: ({ pageParam }) => experienceAPI.getExperiences({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),

  /** 경험정리 메인 페이지의 프로젝트 목록을 커서 기반으로 조회한다. */
  projectList: (workspaceId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.projectList(workspaceId),
      queryFn: ({ pageParam }) => experienceAPI.getExperienceProjects({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experienceProjects.cursor.hasNext ? lastPage.experienceProjects.cursor.nextCursor : null)
    }),

  /** 키워드(경험 이름·태그)로 경험을 검색한다. 검색창 드롭다운용으로 상위 `size`개만 조회한다. */
  search: (workspaceId: string, keyword: string, size = 10) =>
    queryOptions({
      queryKey: experienceKeys.search(workspaceId, keyword),
      queryFn: () => experienceAPI.getSearchExperiences({ workspaceId, keyword, size })
    })
}

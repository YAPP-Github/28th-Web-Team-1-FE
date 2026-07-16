import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'

export const experienceKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...experienceKeys.lists(), workspaceId] as const,
  listByProject: (workspaceId: string, projectId: string) => [...experienceKeys.lists(), workspaceId, 'project', projectId] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (workspaceId: string, experienceId: string) => [...experienceKeys.details(), workspaceId, experienceId] as const,
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

  /** 경험 상세 페이지의 특정 프로젝트에 속한 경험 목록을 커서 기반으로 조회한다. */
  listByProject: (workspaceId: string, projectId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.listByProject(workspaceId, projectId),
      queryFn: ({ pageParam }) => experienceAPI.getProjectExperiences({ workspaceId, projectId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),

  /** 경험 상세 패널에서 여는 경험 단건(제목·태그·STAR 상세)을 조회한다. */
  detail: (workspaceId: string, experienceId: string) =>
    queryOptions({
      queryKey: experienceKeys.detail(workspaceId, experienceId),
      queryFn: () => experienceAPI.getExperience({ workspaceId, experienceId })
    }),

  /** 키워드(경험 이름·태그)로 경험을 검색한다. 검색창 드롭다운용으로 상위 `size`개만 조회한다. */
  search: (workspaceId: string, keyword: string, size = 10) =>
    queryOptions({
      queryKey: experienceKeys.search(workspaceId, keyword),
      queryFn: () => experienceAPI.getSearchExperiences({ workspaceId, keyword, size })
    })
}

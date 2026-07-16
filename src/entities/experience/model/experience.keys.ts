import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'

export const experienceKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...experienceKeys.lists(), workspaceId] as const,
  matches: () => [...experienceKeys.all, 'matched'] as const,
  matched: (workspaceId: string, jdId: string) => [...experienceKeys.matches(), workspaceId, jdId] as const,
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

  /** JD 기준으로 매칭된 경험 목록을 조회한다. 각 경험에 matchRate와 상위 5개 recommendedReason이 채워진다. */
  matched: (workspaceId: string, jdId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.matched(workspaceId, jdId),
      queryFn: ({ pageParam }) => experienceAPI.getMatchedExperiences({ workspaceId, jdId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),

  /** 키워드(경험 이름·태그)로 경험을 검색한다. 검색창 드롭다운용으로 상위 `size`개만 조회한다. */
  search: (workspaceId: string, keyword: string, size = 10) =>
    queryOptions({
      queryKey: experienceKeys.search(workspaceId, keyword),
      queryFn: () => experienceAPI.getSearchExperiences({ workspaceId, keyword, size })
    })
}

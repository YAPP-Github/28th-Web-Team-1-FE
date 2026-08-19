import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import type { ResumeStatusType } from '@shared/lib/gql/graphql'
import { resumeAPI } from '../api/resume.api'

export const resumeKeys = {
  all: ['resume'] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (workspaceId: string, resumeId: string) => [...resumeKeys.details(), workspaceId, resumeId] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (workspaceId: string, status: ResumeStatusType) => [...resumeKeys.lists(), workspaceId, status] as const,
  allList: (workspaceId: string) => [...resumeKeys.lists(), workspaceId, 'all'] as const,
  counts: (workspaceId: string) => [...resumeKeys.all, 'counts', workspaceId] as const
}

export const resumeQueries = {
  /** 이력서 상세를 조회한다. (미리보기·편집 화면용 전체 스냅샷) */
  detail: (workspaceId: string, resumeId: string) =>
    queryOptions({
      queryKey: resumeKeys.detail(workspaceId, resumeId),
      queryFn: () => resumeAPI.getResume({ workspaceId, resumeId })
    }),

  /**
   * 이력서 목록을 커서 기반으로 조회한다.
   * `status`가 있으면 상태별(진행중/완료) 섹션 미리보기용으로, 없으면 전체 목록용으로 별도 캐시·페이지네이션을 갖는다.
   */
  list: (workspaceId: string, status: ResumeStatusType | null, size = 5) =>
    infiniteQueryOptions({
      queryKey: status ? resumeKeys.list(workspaceId, status) : resumeKeys.allList(workspaceId),
      queryFn: ({ pageParam }) => resumeAPI.getResumes({ workspaceId, size, cursor: pageParam, statuses: status ? [status] : null }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.resumes.cursor.hasNext ? lastPage.resumes.cursor.nextCursor : null)
    }),

  /** 상태별 이력서 개수를 조회한다. (섹션 헤더의 총 개수 표시용) */
  counts: (workspaceId: string) =>
    queryOptions({
      queryKey: resumeKeys.counts(workspaceId),
      queryFn: () => resumeAPI.getResumeCounts({ workspaceId })
    })
}

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import type { ResumeStatusType } from '@shared/lib/gql/graphql'
import { resumeAPI } from '../api/resume.api'

export const resumeKeys = {
  all: ['resume'] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (workspaceId: string, resumeId: string) => [...resumeKeys.details(), workspaceId, resumeId] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (workspaceId: string, status: ResumeStatusType) => [...resumeKeys.lists(), workspaceId, status] as const,
  counts: (workspaceId: string) => [...resumeKeys.all, 'counts', workspaceId] as const
}

export const resumeQueries = {
  /** 이력서 상세를 조회한다. (미리보기·편집 화면용 전체 스냅샷) */
  detail: (workspaceId: string, resumeId: string) =>
    queryOptions({
      queryKey: resumeKeys.detail(workspaceId, resumeId),
      queryFn: () => resumeAPI.getResume({ workspaceId, resumeId })
    }),

  /** 이력서 목록을 상태별(진행중·완료)로 커서 기반 조회한다. */
  list: (workspaceId: string, status: ResumeStatusType, size = 5) =>
    infiniteQueryOptions({
      queryKey: resumeKeys.list(workspaceId, status),
      queryFn: ({ pageParam }) => resumeAPI.getResumes({ workspaceId, size, cursor: pageParam, statuses: [status] }),
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

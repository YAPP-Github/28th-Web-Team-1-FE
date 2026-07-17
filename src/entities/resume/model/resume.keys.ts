import { queryOptions } from '@tanstack/react-query'
import { resumeAPI } from '../api/resume.api'

export const resumeKeys = {
  all: ['resume'] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (workspaceId: string, resumeId: string) => [...resumeKeys.details(), workspaceId, resumeId] as const
}

export const resumeQueries = {
  /** 이력서 상세를 조회한다. (미리보기·편집 화면용 전체 스냅샷) */
  detail: (workspaceId: string, resumeId: string) =>
    queryOptions({
      queryKey: resumeKeys.detail(workspaceId, resumeId),
      queryFn: () => resumeAPI.getResume({ workspaceId, resumeId })
    })
}

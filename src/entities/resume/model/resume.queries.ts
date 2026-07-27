'use client'
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { ResumeStatusType } from '@shared/lib/gql/graphql'
import { resumeQueries } from './resume.keys'

/**
 * 이력서 상세를 Suspense로 조회한다.
 * `sections`는 서버가 정한 순서·노출·제목을 그대로 담고 있으며, 각 아이템의 `payload`에는
 * 섹션 타입과 일치하는 필드 하나가 채워진다. (렌더 측에서 `type`으로 분기)
 * @param workspaceId 현재 워크스페이스 ID
 * @param resumeId 라우트 `[id]`에서 온 이력서 ID
 * @example
 * ```tsx
 * const { resume } = useResumeDetail(useWorkspaceId(), resumeId)
 * ```
 */
export const useResumeDetail = (workspaceId: string, resumeId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...resumeQueries.detail(workspaceId, resumeId),
    select: (data) => data.resume
  })
  return { resume: data, ...rest }
}

/**
 * 특정 상태(진행중 DRAFT / 완료 COMPLETED)의 이력서 목록을 Suspense로 조회한다.
 * 커서 기반 페이지들을 하나의 배열로 평탄화해 돌려준다.
 * @param workspaceId 현재 워크스페이스 ID
 * @param status 조회할 이력서 상태
 * @example
 * ```tsx
 * const { resumes, hasNextPage, fetchNextPage } = useResumeList(workspaceId, 'DRAFT')
 * ```
 */
export const useResumeList = (workspaceId: string, status: ResumeStatusType) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...resumeQueries.list(workspaceId, status),
    select: (data) => data.pages.flatMap((page) => page.resumes.resumes)
  })
  return { resumes: data, ...rest }
}

/**
 * 상태별 이력서 개수를 Suspense로 조회한다. 섹션 헤더의 총 개수 표시용.
 * @param workspaceId 현재 워크스페이스 ID
 * @returns 상태를 키로 하는 개수 맵 (예: `counts.DRAFT`, `counts.COMPLETED`)
 */
export const useResumeCounts = (workspaceId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...resumeQueries.counts(workspaceId),
    select: (data) =>
      data.resumeCounts.reduce<Partial<Record<ResumeStatusType, number>>>((acc, { status, count }) => {
        acc[status] = Number(count)
        return acc
      }, {})
  })
  return { counts: data, ...rest }
}

'use client'
import { useEffect } from 'react'
import { useInfiniteQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
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
 * 워크스페이스 전체 이력서(진행중+완료) 목록을 조회한다. 대상 이력서(`resumeId`)를 찾을 때까지만 다음 페이지를 이어서 불러온다.
 * `resume_sequence` 트래킹처럼 전체 목록이 필요한 곳에서 쓴다. 순번 계산 등 목록을 어떻게 쓸지는 호출부 책임이다.
 * @param workspaceId 현재 워크스페이스 ID
 * @param resumeId 목록에서 찾을 때까지 페이지를 불러올 기준 이력서 ID
 */
export const useAllResumes = (workspaceId: string, resumeId: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(resumeQueries.allList(workspaceId))
  const resumes = data?.pages.flatMap((page) => page.resumes.resumes) ?? []
  const isFound = resumes.some((resume) => resume.resumeId === resumeId)

  useEffect(() => {
    if (!isFound && hasNextPage && !isFetching) void fetchNextPage()
  }, [isFound, hasNextPage, isFetching, fetchNextPage])

  return resumes
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

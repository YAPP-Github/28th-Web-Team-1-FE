'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jdQueries } from './jd.keys'

/**
 * 등록된 JD의 분석 인사이트(핵심/지원 전략)를 Suspense로 조회한다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId `registerJd` 결과로 받은 JD ID(`?jdId=`)
 * @example
 * ```tsx
 * const { insight } = useJdInsight(workspaceId, jdId)
 * insight?.keyPoints // 핵심
 * insight?.strategy  // 지원 전략
 * ```
 */
export const useJdInsight = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.insight(workspaceId, jdId),
    select: (data) => data.jdInsight
  })
  return { insight: data, ...rest }
}

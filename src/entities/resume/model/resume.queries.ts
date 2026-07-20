'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
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

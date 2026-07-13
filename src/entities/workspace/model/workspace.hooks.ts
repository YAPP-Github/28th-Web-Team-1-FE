'use client'
import { useParams } from 'next/navigation'

/**
 * 현재 라우트(`/workspace/[workspaceId]/...`)의 workspaceId를 반환한다.
 * URL이 유일한 출처(pipeline)이며, API 조회/변경 훅에 넘길 workspaceId를 여기서 얻는다.
 * (별도 Provider 없이 라우터에서 직접 읽으므로 결합도가 낮다.)
 * @example
 * ```tsx
 * const workspaceId = useWorkspaceId()
 * const { projects } = useExperienceProjectList(workspaceId)
 * ```
 */
export const useWorkspaceId = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  return workspaceId
}

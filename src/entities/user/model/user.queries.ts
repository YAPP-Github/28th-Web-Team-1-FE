'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueries } from './user.keys'

/**
 * 현재 사용자의 첫 번째 워크스페이스 ID를 `workspaces` 쿼리에서 확정해서 반환한다.
 * (URL에 workspaceId를 두지 않고, 서버 데이터 기반으로 가져오는 방식 — 추후 팀 논의 예정)
 * @example
 * ```tsx
 * const workspaceId = useWorkspaceId()
 * const { projects } = useExperienceProjectList(workspaceId)
 * ```
 */
export const useWorkspaceId = () => {
  const { data } = useSuspenseQuery({
    ...userQueries.me(),
    select: (data) => data.me.workspaces[0]?.workspaceId ?? ''
  })
  return data
}

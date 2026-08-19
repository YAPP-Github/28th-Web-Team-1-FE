'use client'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
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

/**
 * 현재 로그인한 사용자 정보(이름/이메일 등)를 Suspense로 조회한다.
 * @example
 * ```tsx
 * const { me } = useMe()
 * me.name  // 이름
 * me.email // 이메일
 * ```
 */
export const useMe = () => {
  const { data } = useSuspenseQuery({
    ...userQueries.me(),
    select: (data) => data.me
  })
  return { me: data }
}

/**
 * 로그인 정보를 확인하기 위한 쿼리.
 * @example
 * ```tsx
 * const { data } = useMeQuery()
 * if (data?.me.userId) amplitude.setUserId(data.me.userId)
 * ```
 */
export const useMeQuery = () => useQuery({ ...userQueries.me() })

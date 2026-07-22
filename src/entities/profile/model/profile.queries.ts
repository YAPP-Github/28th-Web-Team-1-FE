'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { profileQueries } from './profile.keys'

/**
 * 이력서 기본 정보 프로필을 Suspense로 조회한다.
 * 서버가 이력서 PDF에서 파싱한 이름·연락처와 학력/경력/수상/어학/자격증/기술 목록을 담고 있으며,
 * 프로필이 없으면 서버가 빈 프로필을 생성해 반환한다.
 * @param workspaceId 현재 워크스페이스 ID
 * @example
 * ```tsx
 * const profile = useProfile(useWorkspaceId())
 * ```
 */
export const useProfile = (workspaceId: string) => {
  const { data } = useSuspenseQuery({
    ...profileQueries.detail(workspaceId),
    select: (data) => data.profile
  })
  return data
}

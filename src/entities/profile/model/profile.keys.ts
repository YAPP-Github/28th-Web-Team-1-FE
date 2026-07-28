import { queryOptions } from '@tanstack/react-query'
import { profileAPI } from '../api/profile.api'

export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (workspaceId: string) => [...profileKeys.details(), workspaceId] as const,
  generateCoreCompetency: () => [...profileKeys.all, 'generate-core-competency'] as const
}

export const profileQueries = {
  /** 이력서 기본 정보 프로필을 조회한다 */
  detail: (workspaceId: string) =>
    queryOptions({
      queryKey: profileKeys.detail(workspaceId),
      queryFn: () => profileAPI.getProfile({ workspaceId })
    })
}

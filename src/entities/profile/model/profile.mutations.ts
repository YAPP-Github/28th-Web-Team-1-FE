'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type UpdateProfileRequest } from '@shared/lib/gql/graphql'
import { profileAPI } from '../api/profile.api'
import { profileKeys } from './profile.keys'

/**
 * 이력서 기본 정보 프로필을 수정한다. (전체 스냅샷 — 섹션 리스트는 전체 교체)
 * 성공 시 프로필 캐시를 무효화해 이후 조회가 갱신되도록 한다.
 * @param workspaceId 현재 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useUpdateProfile(workspaceId)
 * mutate(request, { onSuccess: () => onDone() })
 * ```
 */
export const useUpdateProfile = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: UpdateProfileRequest) => {
      const { updateProfile } = await profileAPI.updateProfile({ workspaceId, request })
      return updateProfile
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.detail(workspaceId) })
  })
}

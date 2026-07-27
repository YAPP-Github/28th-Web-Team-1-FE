'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type CreateResumeInput, type SaveResumeInput } from '@shared/lib/gql/graphql'
import { resumeAPI } from '../api/resume.api'
import { resumeKeys } from './resume.keys'

/**
 * 이력서를 전체 스냅샷 단위로 생성한다.
 * 생성된 이력서의 `resumeId`가 담긴 결과를 반환한다.
 * @param workspaceId 현재 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateResume(workspaceId)
 * mutate(input, { onSuccess: ({ resumeId }) => router.push(`/home/resume/${resumeId}`) })
 * ```
 */
export const useCreateResume = (workspaceId: string) => {
  return useMutation({
    mutationFn: async (input: CreateResumeInput) => {
      const { createResume } = await resumeAPI.createResume({ workspaceId, input })
      return createResume
    }
  })
}

/**
 * 기존 이력서를 전체 스냅샷 단위로 수정한다.
 * 요청에 없는 기존 섹션·아이템은 서버에서 삭제되므로, 편집 화면의 전체 상태를 그대로 담아 보낸다.
 * 성공 시 해당 이력서 상세와 함께 목록·개수 캐시도 무효화한다.
 * @param workspaceId 현재 워크스페이스 ID
 * @param resumeId 수정할 이력서 ID
 * @example
 * ```tsx
 * const { mutate } = useUpdateResume(workspaceId, resumeId)
 * mutate(input, { onSuccess: () => toast.success('저장되었습니다') })
 * ```
 */
export const useUpdateResume = (workspaceId: string, resumeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SaveResumeInput) => {
      const { updateResume } = await resumeAPI.updateResume({ workspaceId, resumeId, input })
      return updateResume
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(workspaceId, resumeId) })
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: resumeKeys.counts(workspaceId) })
    }
  })
}

'use client'
import { useMutation } from '@tanstack/react-query'
import { type SaveResumeInput } from '@shared/lib/gql/graphql'
import { resumeAPI } from '../api/resume.api'

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
    mutationFn: async (input: SaveResumeInput) => {
      const { createResume } = await resumeAPI.createResume({ workspaceId, input })
      return createResume
    }
  })
}

'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'
import { experienceKeys } from './experience.keys'
import type { CreateExperienceProjectInput } from './experience.types'

/**
 * 경험 프로젝트를 생성한다. 성공 시 프로젝트 목록 캐시를 무효화해 메인 페이지가 갱신되도록 한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateExperienceProject(workspaceId)
 * mutate({ name: '프로젝트명', summary: '경험 내용' })
 * ```
 */
export const useCreateExperienceProject = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateExperienceProjectInput) => {
      const { createExperienceProject } = await experienceAPI.createExperienceProject({ workspaceId, input })
      return createExperienceProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.projects() })
    }
  })
}

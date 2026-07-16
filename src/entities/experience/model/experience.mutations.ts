'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'
import { experienceKeys } from './experience.keys'
import type { CreateExperienceInput, UpdateExperienceInput } from './experience.types'

/**
 * 경험을 생성한다. 성공 시 해당 프로젝트의 경험 목록 캐시를 무효화한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 경험을 추가할 프로젝트 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateExperience(workspaceId, projectId)
 * mutate({ projectId, title: '경험 제목', contents: { type: 'STAR', star: emptyStar } })
 * ```
 */
export const useCreateExperience = (workspaceId: string, projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: CreateExperienceInput) => {
      const { createExperience } = await experienceAPI.createExperience({ workspaceId, request })
      return createExperience
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: experienceKeys.listByProject(workspaceId, projectId) })
  })
}

/**
 * 경험을 수정한다(STAR 상세 저장 등). 성공 시 경험 단건과 프로젝트 경험 목록 캐시를 무효화한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 경험이 속한 프로젝트 ID (목록 캐시 무효화용)
 * @example
 * ```tsx
 * const { mutate } = useUpdateExperience(workspaceId, projectId)
 * mutate({ experienceId, request: { contents: { type: 'STAR', star } } })
 * ```
 */
export const useUpdateExperience = (workspaceId: string, projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ experienceId, request }: { experienceId: string; request: UpdateExperienceInput }) => {
      const { updateExperience } = await experienceAPI.updateExperience({ workspaceId, experienceId, request })
      return updateExperience
    },
    onSuccess: (_data, { experienceId }) => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.detail(workspaceId, experienceId) })
      queryClient.invalidateQueries({ queryKey: experienceKeys.listByProject(workspaceId, projectId) })
    }
  })
}

/**
 * 경험을 삭제한다. 성공 시 해당 프로젝트의 경험 목록 캐시를 무효화한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 경험이 속한 프로젝트 ID
 * @example
 * ```tsx
 * const { mutate } = useDeleteExperience(workspaceId, projectId)
 * mutate(experienceId)
 * ```
 */
export const useDeleteExperience = (workspaceId: string, projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (experienceId: string) => {
      const result = await experienceAPI.deleteExperience({ workspaceId, experienceId })
      return result.deleteExperience
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: experienceKeys.listByProject(workspaceId, projectId) })
  })
}

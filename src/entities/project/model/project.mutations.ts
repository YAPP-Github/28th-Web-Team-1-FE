'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectAPI } from '../api/project.api'
import { projectKeys } from './project.keys'
import type { CreateProjectInput, UpdateProjectInput } from './project.types'

/**
 * 경험 프로젝트를 생성한다. 성공 시 프로젝트 목록 캐시를 무효화해 메인 페이지가 갱신되도록 한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateProject(workspaceId)
 * mutate({ name: '프로젝트명', summary: '경험 내용' })
 * ```
 */
export const useCreateProject = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { createProject } = await projectAPI.createProject({ workspaceId, input })
      return createProject
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  })
}

/**
 * 경험 프로젝트를 수정한다. 성공 시 해당 프로젝트 단건과 목록 캐시를 무효화한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 수정할 프로젝트 ID
 * @example
 * ```tsx
 * const { mutate } = useUpdateProject(workspaceId, projectId)
 * mutate({ name: '프로젝트명', role: '기획', summary: '설명' })
 * ```
 */
export const useUpdateProject = (workspaceId: string, projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: UpdateProjectInput) => {
      const { updateProject } = await projectAPI.updateProject({ workspaceId, projectId, request })
      return updateProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(workspaceId, projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    }
  })
}

/**
 * 경험 프로젝트를 삭제한다. 성공 시 프로젝트 목록 캐시를 무효화한다. (호출부에서 목록 페이지로 이동)
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useDeleteProject(workspaceId)
 * mutate(projectId, { onSuccess: () => router.push('/experiences') })
 * ```
 */
export const useDeleteProject = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (projectId: string) => {
      const result = await projectAPI.deleteProject({ workspaceId, projectId })
      return result.deleteExperienceProject
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  })
}

/**
 * PDF 이력서 파일을 업로드 해 프로젝트 및 경험을 생성한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateProjectFromPdf(workspaceId)
 * mutate(pdfFile)
 * ```
 */
export const useCreateProjectFromPdf = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pdfFile: File) => projectAPI.createProjectFromPdf({ workspaceId, pdfFile }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  })
}

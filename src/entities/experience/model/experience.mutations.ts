'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'
import { experienceKeys } from './experience.keys'
import type { ExperienceQuestionRoomQuery, SendExperienceQuestionRoomMessageRequest } from '@shared/lib/gql/graphql'
import type { CreateExperienceInput, ExperienceQuestionRoomMessage, UpdateExperienceInput } from './experience.types'

/**
 * 경험을 생성한다. 성공 시 해당 프로젝트의 경험 목록 캐시를 무효화한다. (projectId는 요청 본문에서 가져온다)
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useCreateExperience(workspaceId)
 * mutate({ projectId, title: '경험 제목', contents: { type: 'STAR', star: emptyStar } })
 * ```
 */
export const useCreateExperience = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: CreateExperienceInput) => {
      const { createExperience } = await experienceAPI.createExperience({ workspaceId, request })
      return createExperience
    },
    onSuccess: (_data, variables) => queryClient.invalidateQueries({ queryKey: experienceKeys.listByProject(workspaceId, variables.projectId) })
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

/**
 * 질문 대화방에 사용자 입력을 보내고 AI가 만든 경험 블록과 피드백을 받는다.
 * USER 메시지를 먼저 캐시에 반영하고(낙관적 업데이트), 응답이 오면 AI 메시지를 이어 붙인 뒤 최종적으로 목록을 무효화해 서버 상태와 동기화한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param questionRoomId 메시지를 보낼 질문 대화방 ID
 * @example
 * ```tsx
 * const { mutate: sendMessage, isPending } = useSendExperienceQuestionRoomMessage(workspaceId, questionRoomId)
 * sendMessage({ content: '경험 설명', experienceIds: ['1', '2'] })
 * ```
 */
export const useSendExperienceQuestionRoomMessage = (workspaceId: string, questionRoomId: string) => {
  const queryClient = useQueryClient()
  const queryKey = experienceKeys.questionRoomDetail(workspaceId, questionRoomId)

  return useMutation({
    mutationFn: (request: SendExperienceQuestionRoomMessageRequest) => experienceAPI.sendExperienceQuestionRoomMessage({ workspaceId, questionRoomId, request }),
    onMutate: async (request) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<ExperienceQuestionRoomQuery>(queryKey)

      const optimisticMessage: ExperienceQuestionRoomMessage = {
        messageId: `optimistic-${crypto.randomUUID()}`,
        role: 'USER',
        content: request.content ?? null,
        createdAt: new Date().toISOString(),
        experienceIds: (request.experienceIds ?? []).map(String),
        block: null,
        feedback: null
      }

      queryClient.setQueryData<ExperienceQuestionRoomQuery>(queryKey, (old) =>
        old ? { ...old, experienceQuestionRoom: { ...old.experienceQuestionRoom, messages: [...old.experienceQuestionRoom.messages, optimisticMessage] } } : old
      )

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ExperienceQuestionRoomQuery>(queryKey, (old) =>
        old?.experienceQuestionRoom
          ? { ...old, experienceQuestionRoom: { ...old.experienceQuestionRoom, messages: [...old.experienceQuestionRoom.messages, data.sendExperienceQuestionRoomMessage] } }
          : old
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })
}

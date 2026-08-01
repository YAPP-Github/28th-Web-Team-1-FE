'use client'
import { useMutation } from '@tanstack/react-query'
import { notionAPI } from '../api/notion.api'

interface ImportNotionExperiencesInput {
  connectionId: string
  pageIds: string[]
}

interface ImportNotionExperiencesResult {
  succeeded: string[]
  failed: string[]
}

/**
 * 선택한 Notion 페이지들을 경험으로 가져온다(AI 추출).
 * `importNotionExperiences`가 페이지 1개씩만 받으므로 병렬로 호출하고 결과를 모은다.
 * 전부 실패하면 throw해 `onError`로, 일부라도 성공하면 `onSuccess`로 흐른다(부분 실패는 `failed`로 전달).
 * @param workspaceId 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate, isPending } = useImportNotionExperiences(workspaceId)
 * mutate({ connectionId, pageIds }, { onSuccess: ({ failed }) => ... })
 * ```
 */
export const useImportNotionExperiences = (workspaceId: string) => {
  return useMutation({
    mutationFn: async ({ connectionId, pageIds }: ImportNotionExperiencesInput): Promise<ImportNotionExperiencesResult> => {
      const results = await Promise.allSettled(pageIds.map((pageId) => notionAPI.importExperience({ workspaceId, request: { connectionId, pageId } })))
      const succeeded = pageIds.filter((_, index) => results[index].status === 'fulfilled')
      const failed = pageIds.filter((_, index) => results[index].status === 'rejected')
      if (succeeded.length === 0) throw new Error('Notion에서 경험을 불러오지 못했어요. 연결한 페이지를 확인하고 다시 시도해 주세요.')
      return { succeeded, failed }
    }
  })
}

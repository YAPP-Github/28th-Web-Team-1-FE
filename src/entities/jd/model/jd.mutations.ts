'use client'
import { useMutation } from '@tanstack/react-query'
import { jdAPI, type JdRegisterInput } from '../api/jd.api'

/**
 * JD를 URL(크롤) 또는 붙여넣기(본문)로 등록한다.
 * 단일 공고면 `jd`가, 다중 공고면 `candidates`가 채워진 결과를 반환한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useRegisterJd(workspaceId)
 * mutate({ sourceUrl: 'https://...' })
 * ```
 */
export const useRegisterJd = (workspaceId: string) => {
  return useMutation({
    mutationFn: async (request: JdRegisterInput) => {
      const { registerJd } = await jdAPI.registerJd({ workspaceId, request })
      return registerJd
    }
  })
}

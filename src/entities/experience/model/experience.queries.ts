'use client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { experienceQueries } from './experience.keys'

/**
 * 키워드로 경험을 검색한다. 키워드가 비어 있으면 요청하지 않는다.
 * 타이핑 중 깜빡임을 줄이려 이전 결과를 유지한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param keyword 검색어(호출부에서 디바운스한 값을 넘기는 것을 권장)
 * @example
 * ```tsx
 * const { results } = useSearchExperiences(workspaceId, useDebounce(keyword, 300))
 * ```
 */
export const useSearchExperiences = (workspaceId: string, keyword: string) => {
  const trimmed = keyword.trim()

  const { data, ...rest } = useQuery({
    ...experienceQueries.search(workspaceId, trimmed),
    enabled: Boolean(workspaceId) && trimmed.length > 0,
    placeholderData: keepPreviousData,
    select: (data) => data.searchExperiences.experiences
  })
  return { results: data ?? [], ...rest }
}

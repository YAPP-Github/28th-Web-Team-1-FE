'use client'
import { useSuspenseInfiniteQuery, keepPreviousData, useQuery } from '@tanstack/react-query'
import { experienceQueries } from './experience.keys'

/**
 * 특정 프로젝트에 속한 경험 목록을 Suspense로 조회한다. (경험 상세 페이지 "경험 목록")
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 라우트 `[id]`에서 온 프로젝트 ID
 * @example
 * ```tsx
 * const { experiences } = useProjectExperiences(workspaceId, projectId)
 * ```
 */
export const useProjectExperiences = (workspaceId: string, projectId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.listByProject(workspaceId, projectId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

/**
 * 경험 단건(제목·태그·STAR 상세)을 비-Suspense로 조회한다. 상세 패널이 열릴 때만 호출된다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param experienceId 선택된 경험 ID (없으면 요청하지 않음)
 * @example
 * ```tsx
 * const { experience, isPending } = useExperience(workspaceId, experienceId)
 * ```
 */
export const useExperience = (workspaceId: string, experienceId: string | null) => {
  const { data, ...rest } = useQuery({
    ...experienceQueries.detail(workspaceId, experienceId ?? ''),
    enabled: Boolean(workspaceId) && Boolean(experienceId)
  })
  return { experience: data?.experience ?? null, ...rest }
}

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

export const useExperienceList = (workspaceId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

/**
 * JD 기준으로 매칭된 경험 목록을 Suspense로 조회한다.
 * 각 경험에 해당 JD 기준 matchRate와 상위 5개의 recommendedReason이 함께 채워진다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId 매칭 기준이 될 JD ID
 */
export const useMatchedExperiences = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.matched(workspaceId, jdId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

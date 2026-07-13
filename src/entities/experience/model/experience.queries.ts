'use client'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { userQueries } from '@entities/user'
import { experienceAPI, type CreateExperienceProjectInput } from '../api/experience.api'
import { experienceKeys, experienceQueries } from './experience.keys'

export const useExperienceList = (workspaceId?: string) => {
  const { data, ...rest } = useInfiniteQuery({
    ...experienceQueries.list(workspaceId ?? ''),
    enabled: Boolean(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data ?? [], ...rest }
}

/** 현재 사용자의 첫 번째 워크스페이스 ID를 Suspense로 확정해서 반환한다. */
const useWorkspaceId = () => {
  const { data } = useSuspenseQuery({
    ...userQueries.me(),
    select: (data) => data.me.workspaces[0]?.workspaceId ?? ''
  })
  return data
}

/**
 * 경험정리 메인 페이지의 프로젝트 목록을 Suspense로 조회한다.
 * `me` → workspaceId 의존 관계를 Suspense가 순차 해소하므로 enabled 가드가 필요 없다.
 * @example
 * ```tsx
 * const { projects, hasNextPage, fetchNextPage } = useExperienceProjectList()
 * ```
 */
export const useExperienceProjectList = () => {
  const workspaceId = useWorkspaceId()
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.projectList(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experienceProjects.projects)
  })
  return { projects: data, ...rest }
}

/**
 * 키워드로 경험을 검색한다. 검색창 드롭다운용 훅으로, 키워드가 비어 있으면 요청하지 않는다.
 * workspaceId는 비-Suspense `me` 쿼리로 해소하며, 타이핑 중 깜빡임을 줄이려 이전 결과를 유지한다.
 * @param keyword 검색어(호출부에서 디바운스한 값을 넘기는 것을 권장)
 * @example
 * ```tsx
 * const { results, isFetching } = useSearchExperiences(useDebounce(keyword, 300))
 * ```
 */
export const useSearchExperiences = (keyword: string) => {
  const trimmed = keyword.trim()
  const { data: workspaceId = '' } = useQuery({
    ...userQueries.me(),
    select: (data) => data.me.workspaces[0]?.workspaceId ?? ''
  })
  const { data, ...rest } = useQuery({
    ...experienceQueries.search(workspaceId, trimmed),
    enabled: Boolean(workspaceId) && trimmed.length > 0,
    placeholderData: keepPreviousData,
    select: (data) => data.searchExperiences.experiences
  })
  return { results: data ?? [], ...rest }
}

/**
 * 경험 프로젝트를 생성한다. 성공 시 프로젝트 목록 캐시를 무효화해 메인 페이지가 갱신되도록 한다.
 * Suspense 경계 밖(다이얼로그)에서도 쓰이므로 workspaceId는 비-Suspense `me` 쿼리로 해소한다.
 * @example
 * ```tsx
 * const { mutate } = useCreateExperienceProject()
 * mutate({ name: '프로젝트명', summary: '경험 내용' })
 * ```
 */
export const useCreateExperienceProject = () => {
  const queryClient = useQueryClient()
  const { data: workspaceId = '' } = useQuery({
    ...userQueries.me(),
    select: (data) => data.me.workspaces[0]?.workspaceId ?? ''
  })
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

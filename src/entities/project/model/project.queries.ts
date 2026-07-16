'use client'
import { useInfiniteQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { projectQueries } from './project.keys'

/**
 * 경험정리 메인 페이지의 프로젝트 목록을 Suspense로 조회한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @example
 * ```tsx
 * const { projects, hasNextPage, fetchNextPage } = useProjectList(workspaceId)
 * ```
 */
export const useProjectList = (workspaceId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...projectQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.projectList.projects)
  })
  return { projects: data, ...rest }
}

/**
 * 경험 상세 페이지 상단의 프로젝트 단건 정보를 Suspense로 조회한다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 라우트 `[id]`에서 온 프로젝트 ID
 * @example
 * ```tsx
 * const { project } = useProject(workspaceId, projectId)
 * ```
 */
export const useProject = (workspaceId: string, projectId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...projectQueries.detail(workspaceId, projectId),
    select: (data) => data.project
  })
  return { project: data, ...rest }
}

/**
 * 프로젝트 개수를 비-Suspense로 조회한다. `useProjectList`와 같은 캐시를 읽으므로
 * 목록이 이미 로드돼 있으면 추가 요청 없이 개수를 얻는다. (헤더의 '프로젝트 추가' 제한 체크 등)
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 */
export const useProjectCount = (workspaceId: string) => {
  const { data } = useInfiniteQuery({
    ...projectQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.projectList.projects).length
  })
  return data ?? 0
}

/**
 * 프로젝트 목록을 비-Suspense로 조회한다. `useProjectList`와 같은 캐시를 읽으므로
 * 목록이 이미 로드돼 있으면 추가 요청 없이 목록을 얻는다. (다이얼로그의 프로젝트 선택 Popover 등)
 * @param workspaceId 워크스페이스 ID
 */
export const useProjectOptions = (workspaceId: string) => {
  const { data } = useInfiniteQuery({
    ...projectQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.projectList.projects)
  })
  return data ?? []
}

export const useProjectFilterOptions = (workspaceId?: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...projectQueries.filterOptions(workspaceId ?? ''),
    select: (data) => data.pages.flatMap((page) => page.experienceProjects.projects)
  })
  return { projects: data ?? [], ...rest }
}

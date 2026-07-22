'use client'
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { notionQueries } from './notion.keys'

/**
 * 연결된 Notion 워크스페이스의 페이지 목록을 검색어와 함께 커서 기반으로 조회한다.
 * 검색은 서버(`query` 파라미터)에서 수행하고, 검색어 변경 중에는 이전 목록을 유지해 깜빡임을 막는다.
 * @param workspaceId 워크스페이스 ID
 * @param connectionId Notion 연결 ID. 아직 없으면(`undefined`) 조회하지 않는다.
 * @param query 페이지 제목 검색어(빈 문자열이면 전체 목록)
 * @example
 * ```tsx
 * const { pages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotionPages(workspaceId, connectionId, keyword)
 * ```
 */
export const useNotionPages = (workspaceId: string, connectionId: string | undefined, query: string) => {
  const { data, ...rest } = useInfiniteQuery({
    ...notionQueries.pages(workspaceId, connectionId ?? '', query),
    enabled: Boolean(workspaceId && connectionId),
    placeholderData: keepPreviousData,
    select: (data) => data.pages.flatMap((page) => page.notionPages.pages)
  })
  return { pages: data ?? [], ...rest }
}

/**
 * 사용할 Notion 연결 ID를 결정한다. OAuth 콜백이 URL로 넘긴 값(`fromUrl`)을 우선 사용하고,
 * 없으면(직접 진입·새로고침 후 파라미터 유실 등) 연결 목록의 첫 연결로 폴백한다.
 * 온보딩 직후에는 연결이 하나뿐이라는 전제를 따른다.
 * @param workspaceId 워크스페이스 ID
 * @param fromUrl 콜백 리다이렉트 URL의 `connectionId` 쿼리 파라미터 값
 * @example
 * ```tsx
 * const connectionId = useNotionConnectionId(workspaceId, props.connectionId)
 * ```
 */
export const useNotionConnectionId = (workspaceId: string, fromUrl?: string): string | undefined => {
  const { data } = useQuery({
    ...notionQueries.connections(workspaceId),
    enabled: Boolean(workspaceId) && !fromUrl,
    select: (data) => data.notionConnections.connections[0]?.connectionId
  })
  return fromUrl ?? data
}

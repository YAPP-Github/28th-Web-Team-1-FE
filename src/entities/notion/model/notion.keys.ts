import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { notionAPI } from '../api/notion.api'

export const notionKeys = {
  all: ['notion'] as const,
  connections: (workspaceId: string) => [...notionKeys.all, 'connections', workspaceId] as const,
  pages: (workspaceId: string, connectionId: string, query: string) => [...notionKeys.all, 'pages', workspaceId, connectionId, query] as const
}

export const notionQueries = {
  /** 워크스페이스에 연결된 Notion 연결 목록을 조회한다. 첫 연결의 ID만 필요한 폴백 조회라 최소 개수(1개)만 가져온다. */
  connections: (workspaceId: string) =>
    queryOptions({
      queryKey: notionKeys.connections(workspaceId),
      queryFn: () => notionAPI.getConnections({ workspaceId, size: 1 })
    }),
  /** 연결된 Notion 워크스페이스에서 페이지를 커서 기반으로 검색한다. 빈 검색어면 전체 목록. */
  pages: (workspaceId: string, connectionId: string, query: string) =>
    infiniteQueryOptions({
      queryKey: notionKeys.pages(workspaceId, connectionId, query),
      queryFn: ({ pageParam }) => notionAPI.getPages({ workspaceId, connectionId, query: query || null, size: 20, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.notionPages.cursor.hasNext ? lastPage.notionPages.cursor.nextCursor : null)
    })
}

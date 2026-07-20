import { queryOptions } from '@tanstack/react-query'
import { notionAPI } from '../api/notion.api'

/** 온보딩 페이지 선택은 한 번에 보여주고, 커서 페이지네이션은 후속 과제로 미룬다.
 * 스키마 문서상 상한은 100이지만 실제 서버 검증은 30까지만 허용한다. */
const PAGE_FETCH_SIZE = 30

export const notionKeys = {
  all: ['notion'] as const,
  connections: (workspaceId: string) => [...notionKeys.all, 'connections', workspaceId] as const,
  pages: (workspaceId: string, connectionId: string, query: string) => [...notionKeys.all, 'pages', workspaceId, connectionId, query] as const
}

/**
 * notion 도메인의 queryOptions 팩토리이다.
 * 키(`notionKeys`)와 짝을 이루며, 컴포넌트에서 `useQuery(notionQueries.pages(...))` 형태로 사용한다.
 * @example
 * ```ts
 * const { data } = useQuery(notionQueries.connections(workspaceId));
 * queryClient.invalidateQueries({ queryKey: notionKeys.all }); // 무효화는 키로
 * ```
 */
export const notionQueries = {
  /** 워크스페이스에 연결된 Notion 연결 목록을 조회한다. */
  connections: (workspaceId: string) =>
    queryOptions({
      queryKey: notionKeys.connections(workspaceId),
      queryFn: () => notionAPI.getConnections({ workspaceId })
    }),
  /** 연결된 Notion 워크스페이스에서 페이지를 검색한다. 빈 검색어면 전체 목록. */
  pages: (workspaceId: string, connectionId: string, query: string) =>
    queryOptions({
      queryKey: notionKeys.pages(workspaceId, connectionId, query),
      queryFn: () => notionAPI.getPages({ workspaceId, connectionId, query: query || null, size: PAGE_FETCH_SIZE })
    })
}

'use client'
import { useQuery } from '@tanstack/react-query'
import { userQueries } from './user.queries'

/**
 * 현재 워크스페이스 id (me 응답의 workspaces 기준).
 * Todo: 워크스페이스 선택 개념 생기면 첫 번째 대신 현재 워크스페이스로 교체
 */
export const useCurrentWorkspaceId = () => {
  const { data } = useQuery(userQueries.me())
  return data?.me.workspaces[0]?.workspaceId
}

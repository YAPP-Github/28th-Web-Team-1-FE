'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueries } from './user.queries'

/**
 * 현재 워크스페이스 id (me 응답의 첫 워크스페이스). suspense라 항상 `string`을 보장한다.
 * 워크스페이스가 하나도 없으면 에러를 던져 상위 ErrorBoundary가 처리한다.
 * Todo: 워크스페이스 선택 개념 생기면 첫 번째 대신 현재 워크스페이스로 교체
 */
export const useCurrentWorkspaceId = (): string => {
  const { data } = useSuspenseQuery(userQueries.me())
  const workspaceId = data.me.workspaces[0]?.workspaceId
  if (!workspaceId) throw new Error('워크스페이스가 없습니다.')
  return workspaceId
}

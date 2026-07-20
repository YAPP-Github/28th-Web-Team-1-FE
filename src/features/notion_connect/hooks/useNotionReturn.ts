'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { NOTION_CONNECT_ERROR } from '../lib/notion-oauth'

interface NotionReturnState {
  /** OAuth 콜백이 넘긴 Notion 연결 ID. 콜백을 거쳐 돌아온 게 아니면 `null` */
  connectionId: string | null
}

/**
 * Notion OAuth 콜백(`/auth/notion/callback`)이 페이지로 돌아올 때 URL에 실어 보내는 재진입 파라미터
 * (`?step=notion-page-select&connectionId=...` 또는 `?error=notion`)를 최초 렌더 시점에 한 번 읽는다.
 * 실패면 토스트를 띄우고, 성공·실패와 무관하게 파라미터는 URL에서 지운다(새로고침 시 반복 동작 방지).
 * Notion 연동 진입점이 여러 뷰(온보딩·경험정리)에 있어 feature 레벨에 둔다.
 * @param returnPath 파라미터를 지운 뒤 남길 경로
 * @example
 * ```tsx
 * const { connectionId } = useNotionReturn('/experiences')
 * if (connectionId) setView('notion-select')
 * ```
 */
export const useNotionReturn = (returnPath: string): NotionReturnState => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 최초 렌더 시점의 URL만 보면 되므로, 두 값을 하나의 lazy state initializer로 한 번만 읽어 고정한다.
  const [initial] = useState(() => ({
    connectionId: searchParams.get('step') === 'notion-page-select' ? searchParams.get('connectionId') : null,
    hasError: searchParams.get('error') === NOTION_CONNECT_ERROR
  }))

  useEffect(() => {
    if (initial.hasError) toast.error('Notion 연동에 실패했어요. 다시 시도해 주세요.', { id: 'notion-connect-error', position: 'top-center' })
    if (initial.connectionId || initial.hasError) router.replace(returnPath)
  }, [initial, router, returnPath])

  return { connectionId: initial.connectionId }
}

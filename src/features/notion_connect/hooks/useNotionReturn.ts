'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { NOTION_PAGE_SELECT_STEP, NOTION_CONNECT_ERROR } from '../constants/notion-return'

/**
 * Notion OAuth 콜백(`/auth/notion/callback`)이 페이지로 돌아올 때 URL에 실어 보내는 재진입 파라미터
 * /auth/notion/callback에서 처리 후, 리다이렉트할 때 붙인다.
 * (`?step=notion-page-select&connectionId=...` 또는 `?error=notion`)를 최초 렌더 시점에 한 번 읽는다.
 * 실패(error=notion)이면 토스트를 띄움
 *
 * @param returnPath 파라미터를 지운 뒤 남길 경로
 * @example
 * ```tsx
 * const { connectionId } = useNotionReturn('/experiences')
 * if (connectionId) setView('notion-select')
 * ```
 */
export const useNotionReturn = (returnPath: string) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [initial] = useState(() => ({
    connectionId: searchParams.get('step') === NOTION_PAGE_SELECT_STEP ? searchParams.get('connectionId') : null,
    hasError: searchParams.get('error') === NOTION_CONNECT_ERROR
  }))

  useEffect(() => {
    if (initial.hasError) {
      toast.error('Notion 연동에 실패했어요. 다시 시도해 주세요.', { id: 'notion-connect-error', position: 'top-center' })
    }
    if (initial.connectionId || initial.hasError) {
      router.replace(returnPath)
    }
  }, [initial, router, returnPath])

  return { connectionId: initial.connectionId }
}

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getAccessDeniedMessage, type GraphQLError } from '@shared/lib'

/**
 * 접근 권한이 없는 리소스(남의 프로젝트·경험·이력서 등)로 진입했을 때 토스트를 띄우고 지정한 경로로 돌려보낸다.
 * 메시지는 에러 코드로 자동 결정된다(`getAccessDeniedMessage`) — 돌아갈 위치(`to`)만 페이지가 정한다.
 * `ErrorBoundary`의 fallback에서 `isAccessDeniedError(error)`가 참일 때 렌더하는 컴포넌트 안에서 호출한다.
 * @param error `isAccessDeniedError`로 걸러진 `GraphQLError`
 * @param to 돌려보낼 경로
 * @example
 * ```tsx
 * const AccessDeniedFallback = ({ error }: { error: GraphQLError }) => {
 *   useAccessDeniedRedirect(error, '/experiences')
 *   return null
 * }
 * ```
 */
export const useAccessDeniedRedirect = (error: GraphQLError, to: string) => {
  const router = useRouter()
  const message = getAccessDeniedMessage(error)

  useEffect(() => {
    toast.error(message, { id: 'access-denied', position: 'top-center' })
    router.replace(to)
  }, [message, to, router])
}

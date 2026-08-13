'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * 접근 권한이 없는 리소스(남의 프로젝트·경험·이력서 등)로 진입했을 때 토스트를 띄우고 지정한 경로로 돌려보낸다.
 * `ErrorBoundary`의 fallback에서 `isAccessDeniedError(error)`가 참일 때 렌더하는 컴포넌트 안에서 호출한다.
 * @param message 토스트에 보여줄 메시지
 * @param to 돌려보낼 경로
 * @example
 * ```tsx
 * const AccessDeniedFallback = () => {
 *   useAccessDeniedRedirect('존재하지 않거나 접근 권한이 없는 프로젝트예요.', '/experiences')
 *   return null
 * }
 * ```
 */
export const useAccessDeniedRedirect = (message: string, to: string) => {
  const router = useRouter()

  useEffect(() => {
    toast.error(message, { id: 'access-denied', position: 'top-center' })
    router.replace(to)
  }, [message, to, router])
}

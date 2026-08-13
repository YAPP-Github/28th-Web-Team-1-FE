'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getAuthErrorMessage } from '@shared/lib'

/**
 * 렌더링 결과는 없고, 마운트되면 미들웨어가 붙인 `?error=` 파라미터를 확인해 인증 에러 토스트를 띄운 뒤
 * URL에서 파라미터를 지우는 컴포넌트이다.
 * `useSearchParams`를 쓰므로 `Suspense`로 감싸서 사용한다.
 * @example
 * ```tsx
 * <Suspense fallback={null}>
 *   <AuthErrorToast />
 * </Suspense>
 * ```
 */
export const AuthErrorToast = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [errorCode] = useState(() => searchParams.get('error'))

  useEffect(() => {
    const message = getAuthErrorMessage(errorCode)
    if (!message) return
    toast.error(message, { id: 'auth-error', position: 'top-center' })
    router.replace('/login')
  }, [errorCode, router])

  return null
}

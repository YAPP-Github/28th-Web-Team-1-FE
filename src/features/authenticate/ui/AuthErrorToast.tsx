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
    // TODO : 에러 발생 시 로그인 페이지로 이동하도록 설정. 추후 필요에 따라 다른 페이지로 이동하도록 변경 가능
    router.replace('/login')
  }, [errorCode, router])

  return null
}

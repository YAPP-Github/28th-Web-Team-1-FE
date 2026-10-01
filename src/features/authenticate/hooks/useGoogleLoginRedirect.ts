'use client'
import { useGoogleLogin } from '@react-oauth/google'

/**
 * 구글 로그인을 시작하는 함수를 반환하는 훅이다.
 * 호출하면 인가 코드(auth-code) 플로우로 구글 동의 화면으로 리다이렉트되고, 완료 후 `/auth/google/callback`으로 코드를 받아 돌아온다.
 * @param redirectTo 로그인 성공 후 돌아올 내부 경로. 콜백 라우트에 `state`로 전달된다.
 * @example
 * ```tsx
 * const startLogin = useGoogleLoginRedirect()
 * <Button onClick={() => startLogin()}>로그인</Button>
 * ```
 */
export const useGoogleLoginRedirect = (redirectTo = '/home') =>
  useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '',
    state: redirectTo
  })

'use client'
import { useGoogleLogin } from '@react-oauth/google'
import { cn } from '@shared/lib/cn'
import { GoogleIcon } from '@shared/icon'

/**
 * 구글 로그인을 시작하는 버튼 컴포넌트이다.
 * 클릭하면 인가 코드(auth-code) 플로우로 구글 동의 화면으로 리다이렉트되고, 완료 후 `/auth/google/callback`으로 코드를 받아 돌아온다.
 * @param redirectTo 로그인(기존 회원) 성공 후 돌아올 내부 경로. 콜백 라우트에 `state`로 전달되며,
 * 미지정 시 `/`로 이동한다. (신규 회원은 항상 온보딩으로 이동)
 * @example
 * ```tsx
 * <GoogleLoginButton />                          // 기존 회원 → /
 * <GoogleLoginButton redirectTo="/some-path" /> // 기존 회원 → /some-path
 * ```
 */
export const GoogleLoginButton = ({ redirectTo }: { redirectTo?: string }) => {
  const startLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '',
    state: redirectTo
  })

  return (
    <button
      type="button"
      onClick={() => startLogin()}
      className={cn(
        'ring-btn-outline-border text-text-basic text-body1 flex w-full min-w-83.75 items-center justify-center gap-1.5 rounded-lg py-4 font-semibold ring-1 ring-inset',
        'hover:bg-btn-tertiary-fill-hovered active:bg-btn-tertiary-fill-pressed'
      )}
    >
      <GoogleIcon size={24} />
      Google로 계속하기
    </button>
  )
}

import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, cookieOptions, authFailureRedirect, safeRedirectPath } from '@/src/shared/lib'

const API_URL = process.env.API_URL

interface LoginApiResult {
  accessToken: string
  refreshToken: string
  isNewUser: boolean
}
/**
 * 구글이 인가 코드를 붙여 리다이렉트하는 콜백을 서버에서 처리하는 라우트 핸들러이다.
 * URL의 `code`를 원본 서버와 교환해 서비스 토큰을 받고, httpOnly 쿠키로 심은 뒤 목적지로 리다이렉트한다.
 * 신규 회원(`isNewUser`)은 항상 `/onboarding`으로, 기존 회원은 로그인을 시작한 진입점이 `state`로 넘긴 내부 경로로 돌아간다(미지정 시 `/`).
 * @param request 구글이 보낸 GET 요청(`?code=...&state=...`)
 * @returns 로그인 성공 시 신규 회원은 `/onboarding`, 기존 회원은 `state` 경로, 실패 시 `/?error=auth`로의 리다이렉트 응답
 * @example
 * ```ts
 * // GET /auth/google/callback?code=...&state=/jdurl (기존 회원) → 302 /jdurl + Set-Cookie(access_token, refresh_token)
 * // GET /auth/google/callback?code=...&state=/jdurl (신규 회원) → 302 /onboarding + Set-Cookie(access_token, refresh_token)
 * ```
 */
export const GET = async (request: NextRequest) => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  const { searchParams, pathname } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = safeRedirectPath(searchParams.get('state'))

  if (!code) return authFailureRedirect(origin)

  const redirectUri = `${origin}${pathname}`

  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ provider: 'GOOGLE', authorizationCode: code, redirectUri }),
    cache: 'no-store'
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || data?.ok === false || !data?.result) return authFailureRedirect(origin)

  const { accessToken, refreshToken, isNewUser } = data.result as LoginApiResult

  // 신규 유저는 /onboarding, 기존 유저는 state로 넘어온 경로로 리다이렉트
  const response = NextResponse.redirect(new URL(isNewUser ? '/onboarding' : redirectTo, origin))
  response.cookies.set('access_token', accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  response.cookies.set('refresh_token', refreshToken, cookieOptions(REFRESH_TOKEN_MAX_AGE))
  return response
}

import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, cookieOptions, authFailureRedirect } from '@/src/shared/lib'

const API_URL = process.env.API_URL

/**
 * `state`로 넘어온 리다이렉트 목적지가 안전한 내부 경로인지 검증한다.
 * 외부 URL(`//evil.com`, `https://...`)로의 오픈 리다이렉트를 막기 위해 단일 슬래시로 시작하는 경로만 허용한다.
 * @param state 구글이 echo한 `state` 값(신뢰 불가, 변조 가능)
 * @returns 안전하면 해당 경로, 아니면 `/`
 */
const safeRedirectPath = (state: string | null) => {
  if (!state || !state.startsWith('/') || state.startsWith('//')) return '/'
  return state
}

interface LoginApiResult {
  accessToken: string
  refreshToken: string
  isNewUser: boolean
}
/**
 * 구글이 인가 코드를 붙여 리다이렉트하는 콜백을 서버에서 처리하는 라우트 핸들러이다.
 * URL의 `code`를 원본 서버와 교환해 서비스 토큰을 받고, httpOnly 쿠키로 심은 뒤 목적지로 리다이렉트한다.
 * 기존 회원은 로그인을 시작한 진입점이 `state`로 넘긴 내부 경로로 돌아간다(미지정 시 `/`).
 * @param request 구글이 보낸 GET 요청(`?code=...&state=...`)
 * @returns 로그인 성공 시 `state` 경로, 실패 시 `/?error=auth`로의 리다이렉트 응답
 * @example
 * ```ts
 * // GET /auth/google/callback?code=...&state=/jdurl → 302 /jdurl + Set-Cookie(access_token, refresh_token)
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

  const { accessToken, refreshToken } = data.result as LoginApiResult

  const response = NextResponse.redirect(new URL(redirectTo, origin))
  response.cookies.set('access_token', accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  response.cookies.set('refresh_token', refreshToken, cookieOptions(REFRESH_TOKEN_MAX_AGE))
  return response
}

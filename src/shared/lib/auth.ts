import { NextResponse } from 'next/server'
import { AUTH_ERROR } from './auth-error'

const API_URL = process.env.API_URL

export const ACCESS_TOKEN_MAX_AGE = 30 * 60 // 30분
export const REFRESH_TOKEN_MAX_AGE = 14 * 24 * 60 * 60 // 14일

/** `delete(name)`을 가진 쿠키 컨테이너의 최소 형태. 요청/응답 쿠키와 `cookies()` 스토어가 모두 호환된다. */
type DeletableCookies = { delete: (name: string) => unknown }

/**
 * 인증 토큰 쿠키(access/refresh)를 모두 제거하는 함수이다.
 * 미들웨어의 응답 쿠키, BFF의 `cookies()` 스토어 등 `delete`를 가진 어떤 쿠키 컨테이너에도 쓸 수 있다.
 * @param cookies `delete(name)`을 제공하는 쿠키 컨테이너
 * @example
 * ```ts
 * clearAuthCookies(response.cookies)
 * ```
 */
export const clearAuthCookies = (cookies: DeletableCookies) => {
  cookies.delete('access_token')
  cookies.delete('refresh_token')
}

/**
 * 인증 실패 시 토큰 쿠키를 비우고 401 응답을 반환하는 함수이다.
 * 액세스/리프레시 토큰이 모두 무효해 재인증이 필요한 상황(BFF 프록시 등)에서 쓴다.
 * @param cookies 비울 쿠키 컨테이너
 * @returns `token_expired` 코드의 401 `NextResponse`
 */
export const unauthorizedResponse = (cookies: DeletableCookies) => {
  clearAuthCookies(cookies)
  return NextResponse.json({ ok: false, error: { code: AUTH_ERROR.TOKEN_EXPIRED } }, { status: 401 })
}

/**
 * 로그인 실패 시 홈(`/`)으로 `?error=auth`를 붙여 리다이렉트하는 함수이다.
 * @param origin 리다이렉트 기준 origin(프로토콜+호스트)
 * @returns `/?error=auth`로의 `NextResponse` 리다이렉트
 */
export const authFailureRedirect = (origin: string) => {
  const url = new URL('/', origin)
  url.searchParams.set('error', AUTH_ERROR.AUTH)
  return NextResponse.redirect(url)
}

/**
 * OAuth `state` 등으로 넘어온 리다이렉트 목적지가 안전한 내부 경로인지 검증한다.
 * 외부 URL(`//evil.com`, `https://...`)로의 오픈 리다이렉트를 막기 위해 단일 슬래시로 시작하는 경로만 허용한다.
 * @param path 외부(OAuth 공급자 echo 등)에서 온 경로 값(신뢰 불가, 변조 가능)
 * @returns 안전하면 해당 경로, 아니면 `/`
 * @example
 * ```ts
 * safeRedirectPath('/onboarding')     // '/onboarding'
 * safeRedirectPath('//evil.com')      // '/'
 * ```
 */
export const safeRedirectPath = (path: string | null) => {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return '/'
  return path
}

/**
 * 인증 토큰 쿠키에 사용할 공통 옵션을 생성하는 함수이다.
 * `httpOnly`·`secure`·`sameSite: 'lax'`로 고정하고 만료 시간만 인자로 받는다.
 * `lax`인 이유: OAuth 콜백(cross-site)에서 `/`로 리다이렉트하는 첫 진입에 쿠키가 실려야 하기 때문이다.
 * `strict`면 그 첫 네비게이션에서 쿠키가 누락돼 로그인 직후 인증이 풀린다.
 * @param maxAge 쿠키 만료 시간(초)
 * @example
 * ```ts
 * cookieOptions(ACCESS_TOKEN_MAX_AGE); // { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 1800 }
 * ```
 */
export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: true,
  path: '/',
  maxAge
})

/**
 * refreshToken으로 원본 서버에 accessToken을 갱신하는 함수이다.
 * 성공하면 새 토큰을 반환하고, 네트워크 오류·비정상 응답이면 `null`을 반환한다.
 * @param refreshToken 갱신에 사용할 리프레시 토큰
 * @returns 새 accessToken, 실패 시 `null`
 * @example
 * ```ts
 * const tokens = await refreshTokens(oldRefreshToken); // { accessToken } | null
 * ```
 */
export const refreshTokens = async (refreshToken: string): Promise<{ accessToken: string } | null> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: 'no-store'
    })
    if (!res.ok) return null

    const data = await res.json().catch(() => null)
    const result = data?.result ?? data
    if (!result?.accessToken) return null
    return { accessToken: result.accessToken }
  } catch {
    return null
  }
}

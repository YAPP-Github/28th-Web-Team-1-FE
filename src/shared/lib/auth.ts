import { NextResponse } from 'next/server'

const API_URL = process.env.API_URL

/**
 * 로그인 관련 오류를 식별하는 코드 모음이다.
 * 서버 응답의 `error.code`, OAuth 콜백 리다이렉트의 `?error=` 값으로 공통 사용해 문자열이 흩어지지 않게 한다.
 */
export const AUTH_ERROR = {
  AUTH: 'auth' /** OAuth 콜백에서 인가 코드 누락·토큰 교환 실패 등 로그인 자체가 실패한 경우 */,
  TOKEN_EXPIRED: 'token_expired' /** accessToken 만료 후 refresh까지 실패해 재인증이 필요한 경우 */,
  INTERNAL: 'internal_error' /** 그 밖의 서버 측 처리 실패 */
} as const

export const ACCESS_TOKEN_MAX_AGE = 30 * 60 // 30분
export const REFRESH_TOKEN_MAX_AGE = 14 * 24 * 60 * 60 // 14일

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR]

/** 각 오류 코드에 대응하는 사용자 노출 메시지. 리다이렉트(`?error=`)·토스트 등에서 공통으로 사용한다. */
export const AUTH_ERROR_MESSAGE: Record<AuthErrorCode | 'DEFAULT', string> = {
  [AUTH_ERROR.AUTH]: '로그인에 실패했어요. 다시 시도해 주세요.',
  [AUTH_ERROR.TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [AUTH_ERROR.INTERNAL]: ' 일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
  /** 알 수 없는 코드가 들어왔을 때 보여줄 기본 메시지. */
  DEFAULT: '문제가 발생했어요. 잠시 후 다시 시도해 주세요.'
}

/**
 * 오류 코드 문자열을 사용자 메시지로 변환하는 함수이다.
 * 주로 `?error=` 쿼리 파라미터 값을 받아 화면에 표시할 메시지를 얻는 데 쓴다.
 * @param code 오류 코드(`?error=`/`error.code` 값). 없으면 표시할 메시지가 없다는 뜻으로 `null`을 반환한다.
 * @returns 매핑된 메시지, 알 수 없는 코드면 기본 메시지, 코드가 없으면 `null`
 * @example
 * ```ts
 * getAuthErrorMessage('token_expired') // '세션이 만료되었습니다. 다시 로그인해주세요.'
 * getAuthErrorMessage(null)            // null
 * ```
 */
export const getAuthErrorMessage = (code?: string | null): string | null => {
  if (!code) return null
  return AUTH_ERROR_MESSAGE[code as AuthErrorCode] ?? AUTH_ERROR_MESSAGE.DEFAULT
}

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

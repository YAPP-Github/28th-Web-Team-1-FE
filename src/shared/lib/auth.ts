const API_URL = process.env.API_URL

export const ACCESS_TOKEN_MAX_AGE = 30 * 60 // 30분
export const REFRESH_TOKEN_MAX_AGE = 14 * 24 * 60 * 60 // 14일

/**
 * 인증 토큰 쿠키에 사용할 공통 옵션을 생성하는 함수이다.
 * `httpOnly`·`secure`·`sameSite: 'strict'`로 고정하고 만료 시간만 인자로 받는다.
 * @param maxAge 쿠키 만료 시간(초)
 * @example
 * ```ts
 * cookieOptions(ACCESS_TOKEN_MAX_AGE); // { httpOnly: true, sameSite: 'strict', secure: true, path: '/', maxAge: 1800 }
 * ```
 */
export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: true,
  path: '/',
  maxAge
})

/**
 * refreshToken으로 원본 서버에 accessToken을 갱신하는 함수이다.
 * 성공하면 새 토큰 쌍을 반환하고, 네트워크 오류·비정상 응답이면 `null`을 반환한다.
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
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
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

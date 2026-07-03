'use server'
import { cookies } from 'next/headers'
import { clearAuthCookies } from '@/src/shared/lib'

const API_URL = process.env.API_URL
/**
 * 로그아웃 서버 액션이다.
 * 백엔드에 로그아웃을 통지해 refresh 토큰을 무효화하고, 로컬 httpOnly 토큰 쿠키를 비운 뒤 홈으로 이동한다.
 */
export const logout = async () => {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (refreshToken) {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
      cache: 'no-store'
    })
  }
  clearAuthCookies(cookieStore)
}

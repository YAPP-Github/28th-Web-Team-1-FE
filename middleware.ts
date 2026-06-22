import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, cookieOptions, refreshTokens } from '@/src/shared/lib/auth'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // TODO : 와이어프레임 기반 디자인 확정 후 접근 제어 보강 필요
  //  - 인증이 필요한 페이지 진입 전 middleware에서 accessToken 유무 확인 후 없으면 로그인 페이지로 리다이렉트
  if (accessToken || !refreshToken) return NextResponse.next()

  const tokens = await refreshTokens(refreshToken)

  if (!tokens) {
    const response = NextResponse.next()
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  request.cookies.set('access_token', tokens.accessToken)
  const response = NextResponse.next({ request })

  response.cookies.set('access_token', tokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  return response
}

import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, clearAuthCookies, cookieOptions, refreshTokens, requireAuthRedirect } from '@shared/lib/auth'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

/** 비로그인 상태에서도 접근 가능한 경로. 나머지는 로그인 페이지로 튕긴다. */
const PUBLIC_PATHS = new Set(['/', '/login', '/robots.txt', '/sitemap.xml'])

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // API 프록시(/api)·OAuth 콜백(/auth)은 페이지 네비게이션이 아니라 각자 자체적으로 인증을 처리하므로,
  // 여기서 리다이렉트해버리면(특히 로그인 자체가 아직 안 된 콜백 진입 시) 흐름이 깨진다.
  if (pathname.startsWith('/api') || pathname.startsWith('/auth')) return NextResponse.next()

  const isPublicPath = PUBLIC_PATHS.has(pathname)

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // 보호된 페이지는 브라우저 bfcache에 남으면 안 된다. 로그아웃·탈퇴 후 뒤로가기로 복원되면
  // 미들웨어를 다시 타지 않아 이미 사라진 세션의 화면이 그대로 보이는 문제가 생긴다.
  if (accessToken) {
    const response = NextResponse.next()
    if (!isPublicPath) response.headers.set('Cache-Control', 'no-store')
    return response
  }

  if (!refreshToken) {
    if (isPublicPath) return NextResponse.next()
    return requireAuthRedirect(request)
  }

  const tokens = await refreshTokens(refreshToken)

  if (!tokens) {
    const response = isPublicPath ? NextResponse.next() : requireAuthRedirect(request)
    clearAuthCookies(response.cookies)
    return response
  }

  request.cookies.set('access_token', tokens.accessToken)
  const response = NextResponse.next({ request })

  response.cookies.set('access_token', tokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  if (!isPublicPath) response.headers.set('Cache-Control', 'no-store')
  return response
}

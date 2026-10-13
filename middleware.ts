import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, clearAuthCookies, cookieOptions, refreshTokens, requireAuthRedirect } from '@shared/lib/auth'
import { nextWithLandingVariant } from '@shared/lib/landing-ab' // TODO : AB-TEST(landing) 종료 후 NextResponse.next()로 수정 필요

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

/** 비로그인 상태에서도 접근 가능한 경로. 나머지는 랜딩(/)으로 튕긴다. */
const PUBLIC_PATHS = new Set(['/', '/robots.txt', '/sitemap.xml'])

/** 이미 로그인한 사용자가 볼 필요 없는 경로. 접근 시 /home으로 보낸다. (PUBLIC_PATHS의 부분집합이어야 함) */
const GUEST_ONLY_PATHS = new Set(['/'])

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // API 프록시(/api)·OAuth 콜백(/auth)은 페이지 네비게이션이 아니라 각자 자체적으로 인증을 처리하므로,
  // 여기서 리다이렉트해버리면(특히 로그인 자체가 아직 안 된 콜백 진입 시) 흐름이 깨진다.
  if (pathname.startsWith('/api') || pathname.startsWith('/auth')) return NextResponse.next()

  const isPublicPath = PUBLIC_PATHS.has(pathname)

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (accessToken) {
    if (GUEST_ONLY_PATHS.has(pathname)) return NextResponse.redirect(new URL('/home', request.url))
    return NextResponse.next()
  }

  if (!refreshToken) {
    if (isPublicPath) return nextWithLandingVariant(request) // TODO : AB-TEST(landing)
    return requireAuthRedirect(request)
  }

  const tokens = await refreshTokens(refreshToken)

  if (!tokens) {
    // TODO : AB-TEST(landing)
    const response = isPublicPath ? nextWithLandingVariant(request) : requireAuthRedirect(request)
    clearAuthCookies(response.cookies)
    return response
  }

  if (GUEST_ONLY_PATHS.has(pathname)) {
    const response = NextResponse.redirect(new URL('/home', request.url))
    response.cookies.set('access_token', tokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
    return response
  }

  request.cookies.set('access_token', tokens.accessToken)
  const response = NextResponse.next({ request })

  response.cookies.set('access_token', tokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
  return response
}

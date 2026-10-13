import { NextResponse, userAgent, type NextRequest } from 'next/server'

/** 랜딩 A/B 테스트 전용 모듈. 테스트가 끝나면 `AB-TEST(landing)` 주석이 붙은 사용처와 이 파일을 지운다. */
export const LANDING_VARIANT_COOKIE = 'landing_variant'

/**
 * `/`에 온 실기기가 모바일인 사용자에게 랜딩 A/B를 배정하는 함수이다. 첫 방문 렌더도 결과를 보도록 쿠키를 요청에도 심는다.
 *
 * @param request - 들어온 요청
 * @example
 * if (isPublicPath) return nextWithLandingVariant(request)
 */
export const nextWithLandingVariant = (request: NextRequest) => {
  const isTarget = request.nextUrl.pathname === '/' && userAgent(request).device.type === 'mobile'
  if (!isTarget || request.cookies.has(LANDING_VARIANT_COOKIE)) return NextResponse.next()

  const variant = Math.random() < 0.5 ? 'A' : 'B'
  request.cookies.set(LANDING_VARIANT_COOKIE, variant)
  const response = NextResponse.next({ request })
  response.cookies.set(LANDING_VARIANT_COOKIE, variant, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 })
  return response
}

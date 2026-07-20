import { NextResponse, type NextRequest } from 'next/server'
import { ApiError, authFailureRedirect, safeRedirectPath } from '@/src/shared/lib'
import { notionAPI, decodeNotionState, NOTION_OAUTH_NONCE_COOKIE, NOTION_CONNECT_ERROR } from '@entities/notion'

/**
 * Notion이 인가 코드를 붙여 리다이렉트하는 콜백을 서버에서 처리하는 라우트 핸들러이다.
 * `state`(워크스페이스 ID·복귀 경로·nonce)를 복원하고 nonce를 쿠키와 대조(CSRF 방어)한 뒤,
 * `connectNotion` 뮤테이션으로 코드를 교환해 연결을 만들고 온보딩의 페이지 선택 스텝으로 복귀시킨다.
 * 코드는 1회용이라 클라이언트가 아닌 서버에서 즉시 소모한다(구글 콜백과 동일 구조).
 * @param request Notion이 보낸 GET 요청(`?code=...&state=...` 또는 `?error=...`)
 * @returns 성공 시 `{returnTo}?step=notion-page-select&connectionId=...`, 실패 시 `{returnTo}?error=notion` 리다이렉트
 * @example
 * ```ts
 * // GET /auth/notion/callback?code=...&state=... → 302 /onboarding?step=notion-page-select&connectionId=...
 * ```
 */
export const GET = async (request: NextRequest) => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  const { searchParams, pathname } = new URL(request.url)
  const code = searchParams.get('code')
  const state = decodeNotionState(searchParams.get('state'))
  const returnTo = safeRedirectPath(state?.returnTo ?? null)
  const nonceCookie = request.cookies.get(NOTION_OAUTH_NONCE_COOKIE)?.value

  const redirectWith = (params: Record<string, string>) => {
    const url = new URL(returnTo, origin)
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
    const response = NextResponse.redirect(url)
    response.cookies.delete(NOTION_OAUTH_NONCE_COOKIE)
    return response
  }

  if (searchParams.get('error') || !code || !state || !nonceCookie || nonceCookie !== state.nonce) {
    return redirectWith({ error: NOTION_CONNECT_ERROR })
  }

  try {
    const { connectNotion } = await notionAPI.connectNotion({
      workspaceId: state.workspaceId,
      request: { authorizationCode: code, redirectUri: `${origin}${pathname}` }
    })
    return redirectWith({ step: 'notion-page-select', connectionId: connectNotion.connectionId })
  } catch (error) {
    // 서비스 인증 자체가 만료된 경우는 재로그인으로, 그 외(교환 실패 등)는 온보딩 재시도로 보낸다
    console.error('Notion OAuth callback error', error)
    if (error instanceof ApiError && error.status === 401) return authFailureRedirect(origin)
    return redirectWith({ error: NOTION_CONNECT_ERROR })
  }
}

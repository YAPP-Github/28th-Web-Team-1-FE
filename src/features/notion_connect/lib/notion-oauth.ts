/** Notion OAuth 인가 화면 주소 */
const NOTION_AUTHORIZE_URL = 'https://api.notion.com/v1/oauth/authorize'

/** OAuth 인가 콜백을 처리하는 `redirect_uri` 경로. 실제 라우트는 `app/auth/notion/callback/route.ts`가 담당 */
const NOTION_CALLBACK_PATH = '/auth/notion/callback'

/** OAuth 시작 직전 저장하고 콜백에서 state의 nonce와 대조하는 CSRF 방어용 쿠키 이름 */
export const NOTION_OAUTH_NONCE_COOKIE = 'notion_oauth_nonce'

/**
 * OAuth state 객체를 JSON 문자열로 인코딩한다.
 * @param state 노션 왕복 간 유지할 값
 * @example
 * ```ts
 * encodeNotionState({ workspaceId: 'w1', returnTo: '/onboarding', nonce: 'n' }) // '{"w":"w1","r":"/onboarding","n":"n"}'
 * ```
 */
const encodeNotionState = (state: { workspaceId: string; returnTo: string; nonce: string }): string => JSON.stringify({ w: state.workspaceId, r: state.returnTo, n: state.nonce })

/**
 * Notion OAuth 인가 화면으로 보낼 URL을 조립한다.
 * `redirect_uri`는 Notion 인테그레이션 설정에 등록된 값과 정확히 일치해야 한다.
 * @param params clientId(공개 client_id)·redirectUri(`${origin}${NOTION_CALLBACK_PATH}`)·state(인코딩된 문자열)
 * @example
 * ```ts
 * buildNotionAuthorizeUrl({ clientId, redirectUri: `${origin}/auth/notion/callback`, state })
 * // 'https://api.notion.com/v1/oauth/authorize?client_id=...&response_type=code&owner=user&...'
 * ```
 */
const buildNotionAuthorizeUrl = ({ clientId, redirectUri, state }: { clientId: string; redirectUri: string; state: string }): string => {
  const url = new URL(NOTION_AUTHORIZE_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('owner', 'user')
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('state', state)
  return url.toString()
}

/**
 * Notion OAuth 동의 화면으로 이탈한다. CSRF 방어용 nonce를 쿠키에 심고 `state`에 실어 보낸 뒤,
 * 승인이 끝나면 `${NOTION_CALLBACK_PATH}` 콜백이 코드를 교환하고 `returnTo`로 복귀시킨다.
 * @param workspaceId Notion을 연결할 워크스페이스 ID
 * @param returnTo 연동 완료(혹은 실패) 후 복귀할 내부 경로
 * @example
 * ```ts
 * startNotionOAuth({ workspaceId, returnTo: '/experiences' })
 * ```
 */
export const startNotionOAuth = ({ workspaceId, returnTo }: { workspaceId: string; returnTo: string }) => {
  const nonce = crypto.randomUUID()
  // 콜백에서 state의 nonce와 대조하는 CSRF 방어용 1회성 쿠키 (10분 내 왕복 전제)
  document.cookie = `${NOTION_OAUTH_NONCE_COOKIE}=${nonce}; path=/; max-age=600; samesite=lax`
  const state = encodeNotionState({ workspaceId, returnTo, nonce })
  window.location.assign(
    buildNotionAuthorizeUrl({
      clientId: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID ?? '',
      redirectUri: `${window.location.origin}${NOTION_CALLBACK_PATH}`,
      state
    })
  )
}

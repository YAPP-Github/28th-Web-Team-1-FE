/** Notion OAuth 인가 화면 주소. 승인 시 `redirect_uri`로 1회용 인가 코드를 돌려보낸다. */
const NOTION_AUTHORIZE_URL = 'https://api.notion.com/v1/oauth/authorize'

/** OAuth 시작(클라이언트)과 콜백 라우트(서버)가 공유하는 콜백 경로 */
export const NOTION_CALLBACK_PATH = '/auth/notion/callback'

/** OAuth 시작 직전 저장하고 콜백에서 state의 nonce와 대조하는 CSRF 방어용 쿠키 이름 */
export const NOTION_OAUTH_NONCE_COOKIE = 'notion_oauth_nonce'

/** 연동 실패 시 콜백이 복귀 URL에 붙이는 `?error=` 값. 온보딩·경험정리 페이지가 토스트 표시에 사용한다. */
export const NOTION_CONNECT_ERROR = 'notion'

/**
 * OAuth `state`에 실어 노션 왕복 간 유지하는 값.
 * 노션이 그대로 echo해 주므로 콜백에서 어느 워크스페이스에 연결하고 어디로 복귀할지 알 수 있다.
 */
export interface NotionOAuthState {
  /** Notion을 연결할 워크스페이스 ID */
  workspaceId: string
  /** 연동 완료 후 복귀할 내부 경로 */
  returnTo: string
  /** CSRF 방어용 1회성 랜덤 값. 시작 시 쿠키에도 저장해 콜백에서 대조한다. */
  nonce: string
}

/**
 * OAuth state 객체를 JSON 문자열로 인코딩한다. (`decodeNotionState`의 역변환)
 * URL에 실릴 때의 퍼센트 인코딩은 `URLSearchParams`가 알아서 처리하므로 별도 base64 인코딩은 불필요하다.
 * @param state 노션 왕복 간 유지할 값
 * @example
 * ```ts
 * encodeNotionState({ workspaceId: 'w1', returnTo: '/onboarding', nonce: 'n' }) // '{"w":"w1","r":"/onboarding","n":"n"}'
 * ```
 */
export const encodeNotionState = (state: NotionOAuthState): string => JSON.stringify({ w: state.workspaceId, r: state.returnTo, n: state.nonce })

/**
 * 노션이 echo한 `state` 문자열을 디코딩한다. 변조·손상으로 파싱에 실패하면 `null`.
 * @param raw 콜백 URL의 `state` 쿼리 파라미터 값(신뢰 불가)
 * @example
 * ```ts
 * decodeNotionState(searchParams.get('state')) // { workspaceId, returnTo, nonce } | null
 * ```
 */
export const decodeNotionState = (raw: string | null): NotionOAuthState | null => {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { w, r, n } = parsed as Record<string, unknown>
    if (typeof w !== 'string' || typeof r !== 'string' || typeof n !== 'string') return null
    return { workspaceId: w, returnTo: r, nonce: n }
  } catch {
    return null
  }
}

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
export const buildNotionAuthorizeUrl = ({ clientId, redirectUri, state }: { clientId: string; redirectUri: string; state: string }): string => {
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

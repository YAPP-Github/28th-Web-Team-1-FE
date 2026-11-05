import { test as base, expect, type Page } from '@playwright/test'

/**
 * AI가 생성하는 E2E spec의 공통 fixture.
 * 생성 spec은 반드시 `@playwright/test`가 아닌 이 모듈의 `test`/`expect`를 import한다.
 *
 * - `page`: QA 계정으로 로그인된 상태 (refresh_token 쿠키 주입 → middleware가 access_token 재발급)
 * - `guestPage`: 비로그인 상태 (랜딩 `/` 등 공개 경로 테스트용)
 * - 트래킹(Amplitude/Sentry) 요청은 차단해 노이즈·데이터 오염을 막는다
 */

const TRACKING_HOSTS = /amplitude\.com|sentry\.io|ingest\.sentry/

const blockTracking = async (page: Page) => {
  await page.route(TRACKING_HOSTS, (route) => route.abort())
}

type Fixtures = {
  guestPage: Page
}

// fixture 콜백의 두 번째 인자(Playwright의 `use`)를 `provide`로 부르는 이유: react-hooks 린트가 `use` 호출을 Hook으로 오인한다
export const test = base.extend<Fixtures>({
  page: async ({ page, context, baseURL }, provide) => {
    const refreshToken = process.env.QA_REFRESH_TOKEN
    if (!refreshToken) throw new Error('[e2e-ai] QA_REFRESH_TOKEN 환경변수가 필요합니다 (.env.qa 또는 GitHub Secrets).')

    const url = new URL(baseURL ?? 'http://localhost:3000')
    const isHttps = url.protocol === 'https:'
    const cookie = { domain: url.hostname, path: '/', httpOnly: true, secure: isHttps, sameSite: 'Lax' as const }

    // refresh_token만 넣는다. middleware가 access_token을 새로 발급하므로 refresh 만료 시 스모크가 바로 실패한다.
    // (만료된 access_token을 같이 넣으면 middleware가 검증 없이 통과시켜 refresh 만료를 가린다)
    await context.addCookies([{ name: 'refresh_token', value: refreshToken, ...cookie }])
    await blockTracking(page)
    await provide(page)
  },

  // 기본 `context`를 써야 project의 기기 설정(viewport·UA 등)이 적용된다.
  // `page`를 함께 쓰면 같은 context에 로그인 쿠키가 들어가므로 한 테스트에서 둘을 같이 쓰지 않는다.
  guestPage: async ({ context }, provide) => {
    const page = await context.newPage()
    await blockTracking(page)
    await provide(page)
  }
})

export { expect }

/** BFF 프록시(`/api/graphql`) 응답을 기다린다. operationName을 주면 해당 요청만 매칭한다. */
export const waitForGraphql = (page: Page, operationName?: string) =>
  page.waitForResponse((res) => {
    if (!res.url().includes('/api/graphql')) return false
    if (!operationName) return true
    return (res.request().postData() ?? '').includes(operationName)
  })

/** sonner 토스트에 특정 문구가 노출되는지 확인한다. */
export const expectToast = async (page: Page, text: string | RegExp) => {
  await expect(page.locator('[data-sonner-toast]').filter({ hasText: text }).first()).toBeVisible()
}

/** 로그인이 유지된 채로 보호 경로에 진입했는지 확인한다 (인증 실패 시 `/`로 튕김). */
export const expectAuthenticated = async (page: Page) => {
  await expect(page, '인증 실패: QA 토큰 만료 여부를 확인하세요').not.toHaveURL((url) => url.pathname === '/')
}

/** 테스트 중 생성하는 데이터 이름. QA 계정 정리 시 `[E2E-AI]` 접두사로 식별한다. */
export const e2eName = (label: string) => `[E2E-AI] ${label} ${Date.now()}`

/* ------------------------------------------------------------------ */
/* GraphQL 요청 제어 (SKILL.md 4-1)                                     */
/* ------------------------------------------------------------------ */

/** AI 비용·시간이 드는 작업. 기본으로 실제 호출을 막고, 테스트는 `mock`으로 가짜 응답을 준다. */
export const AI_OPERATIONS = ['GenerateCoreCompetency', 'RegisterJd', 'SendExperienceQuestionRoomMessage', 'PolishProfileText'] as const
/** 외부 서비스 연동. 기본으로 실제 호출을 막는다. */
export const EXTERNAL_OPERATIONS = ['ConnectNotion', 'ImportNotionExperiences'] as const
/** PDF 이력서 추출(AI). GraphQL이 아닌 REST라 별도 패턴으로 막는다. */
const RESUME_IMPORT_URL = /\/api\/v1\/workspaces\/[^/]+\/resume-imports/

type GraphqlBody = { query: string; variables?: Record<string, unknown> }
/** GraphQL 응답 본문(`{ data }` 또는 `{ errors }`). 함수면 요청 variables를 받아 응답을 만든다. */
type MockResponse = Record<string, unknown> | ((variables: Record<string, unknown>) => Record<string, unknown>)

export type GraphqlCall = { operation: string; type: 'query' | 'mutation'; variables: Record<string, unknown>; handled: 'mock' | 'block' | 'transform' | 'pass' }

type RouteGraphqlOptions = {
  /** 오퍼레이션 이름 → 가짜 응답. 실제 서버로 보내지 않는다 */
  mock?: Record<string, MockResponse>
  /** 오퍼레이션 이름 → 실제 응답의 `data`를 가공. 적용 횟수는 `transformed`로 확인한다 */
  transform?: Record<string, (data: any) => any>
  /** 실제로 보내지 않고 막을 오퍼레이션 이름 (요청 본문은 `calls`에 남는다). `'mutations'`면 모든 mutation */
  block?: string[] | 'mutations'
  /** true면 AI·외부 연동 오퍼레이션도 실제로 보낸다. AI 기능 자체를 바꾼 PR의 대표 흐름 1개에만 쓴다 */
  allowAiCalls?: boolean
}

/**
 * 페이지의 GraphQL 요청을 한 곳에서 제어한다. 테스트당 한 번만 호출한다 (route 핸들러가 겹치지 않도록).
 * - AI·외부 연동 오퍼레이션은 `mock`이 없으면 기본 차단된다 (실수로 실제 호출되는 것을 막는 안전장치)
 * - 나머지는 실제 서버로 보낸다 (테스트가 만든 데이터의 생성·수정·삭제는 실제로 실행)
 * @example
 * ```ts
 * const gqlRoute = await routeGraphql(page, {
 *   mock: { GenerateCoreCompetency: { data: { generateCoreCompetency: { coreCompetency: 'E2E 핵심역량', strategy: 'E2E 전략' } } } },
 *   transform: { Resume: (data) => ({ ...data, resume: { ...data.resume, sections: [] } }) }
 * })
 * expect(gqlRoute.transformed.Resume).toBeGreaterThan(0)
 * expect(gqlRoute.calls.filter((c) => c.operation === 'UpdateResume')).toHaveLength(1)
 * ```
 */
export const routeGraphql = async (page: Page, options: RouteGraphqlOptions = {}) => {
  const calls: GraphqlCall[] = []
  const transformed: Record<string, number> = {}
  const guarded = new Set<string>(options.allowAiCalls ? [] : [...AI_OPERATIONS, ...EXTERNAL_OPERATIONS])

  if (!options.allowAiCalls) {
    await page.route(RESUME_IMPORT_URL, (route) => route.abort())
  }

  await page.route('**/api/graphql', async (route) => {
    let body: GraphqlBody
    try {
      body = JSON.parse(route.request().postData() ?? '')
    } catch {
      return route.continue()
    }
    const operation = /\b(?:query|mutation)\s+(\w+)/.exec(body.query)?.[1] ?? ''
    const type = /^\s*mutation\b/.test(body.query) ? 'mutation' : 'query'
    const variables = body.variables ?? {}
    const record = (handled: GraphqlCall['handled']) => calls.push({ operation, type, variables, handled })

    const mock = options.mock?.[operation]
    if (mock) {
      record('mock')
      const json = typeof mock === 'function' ? mock(variables) : mock
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) })
    }

    const isBlocked = options.block === 'mutations' ? type === 'mutation' : (options.block?.includes(operation) ?? false)
    if (isBlocked || guarded.has(operation)) {
      record('block')
      return route.abort()
    }

    const transform = options.transform?.[operation]
    if (transform) {
      const response = await route.fetch()
      const json = await response.json()
      json.data = transform(json.data)
      transformed[operation] = (transformed[operation] ?? 0) + 1
      record('transform')
      return route.fulfill({ response, json })
    }

    record('pass')
    return route.continue()
  })

  return { calls, transformed }
}

/**
 * 브라우저 화면을 거치지 않고 BFF(`/api/graphql`)로 GraphQL을 직접 호출한다. 로그인 쿠키를 공유한다.
 * 테스트가 만든 데이터를 `finally`에서 정리할 때 쓴다. (`page.route`를 거치지 않으므로 `routeGraphql` 차단과 무관)
 * @example
 * ```ts
 * await gql(page, 'mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) { deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId) }', { workspaceId, experienceId })
 * ```
 */
export const gql = async <T = Record<string, unknown>>(page: Page, query: string, variables: Record<string, unknown> = {}): Promise<T> => {
  const response = await page.request.post('/api/graphql', { data: { query, variables } })
  const json = await response.json()
  if (!response.ok() || json.errors?.length) throw new Error(`[e2e-ai] gql 실패: ${JSON.stringify(json.errors ?? json)}`)
  return json.data as T
}

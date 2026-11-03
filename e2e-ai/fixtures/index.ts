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

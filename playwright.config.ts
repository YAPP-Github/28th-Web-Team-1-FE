import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

// 로컬 실행 시 QA 토큰(.env.qa)을 읽는다. CI에서는 GitHub Secrets가 env로 주입된다.
dotenv.config({ path: '.env.qa', quiet: true })

/**
 * AI E2E(`/e2e-from-pr`, `.github/workflows/e2e-ai.yml`) 전용 Playwright 설정.
 * spec은 AI가 PR마다 `e2e-ai/generated/`에 일회성으로 생성하며 레포에 커밋하지 않는다.
 * 대상 URL은 `E2E_BASE_URL`(Vercel Preview 등), 없으면 로컬 dev 서버.
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/** Vercel Deployment Protection 우회 헤더. 시크릿이 있을 때만 붙인다. */
const bypassSecret = process.env.VERCEL_BYPASS_SECRET
const extraHTTPHeaders = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret, 'x-vercel-set-bypass-cookie': 'true' } : undefined

export default defineConfig({
  testDir: 'e2e-ai/generated',
  outputDir: 'test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // QA 계정 하나를 공유하므로 데이터 충돌 방지
  workers: 1,
  retries: 0, // flaky 여부는 AI가 직접 판단한다
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list'], ['json', { outputFile: 'e2e-ai/report.json' }], ['html', { open: 'never' }]],
  use: {
    baseURL,
    extraHTTPHeaders,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    // 로컬 dev의 MSW 서비스워커가 page.route 가로채기와 충돌해 페이지가 멈추므로 막는다 (Preview에는 영향 없음)
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // 모바일 project는 `@mobile` 태그가 붙은 테스트만 실행한다
    { name: 'mobile', use: { ...devices['iPhone 14'], defaultBrowserType: 'chromium' }, grep: /@mobile/ }
  ]
})

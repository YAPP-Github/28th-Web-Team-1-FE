/**
 * 인증·환경 스모크 테스트 템플릿.
 * `/e2e-from-pr` 실행 시 `e2e-ai/generated/00-smoke.spec.ts`로 복사해 가장 먼저 돌린다.
 * 실패하면 이후 TC는 실행하지 않고 "환경 문제"로 보고한다. 생성 spec 작성 시 참고 예시이기도 하다.
 */
import { expect, expectAuthenticated, test } from '../fixtures'

test('SMOKE | 로그인 상태로 /home 진입', async ({ page }) => {
  const response = await page.goto('/home')
  expect(response?.status(), 'Preview 접근 실패 (Vercel Protection 또는 배포 오류)').toBeLessThan(400)
  await expectAuthenticated(page)
})

test('SMOKE | 비로그인 랜딩 진입', async ({ guestPage }) => {
  const response = await guestPage.goto('/')
  expect(response?.status()).toBeLessThan(400)
})

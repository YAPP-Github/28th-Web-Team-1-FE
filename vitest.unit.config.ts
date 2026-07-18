import { defineConfig } from 'vitest/config'

// 기존 vitest.config.ts는 Storybook 브라우저 테스트 전용이라, 순수 로직 유닛 테스트는 이 설정으로 분리한다.
// 실행: npm run test:unit
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})

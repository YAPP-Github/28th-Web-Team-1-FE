'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Theme, Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'
import '../src/app/style/globals.css'

// 클라이언트 렌더링 중 발생한 에러는 window.onerror로 전파되지 않고 React 에러 바운더리가 먼저 가로채므로, Sentry에 명시적으로 보고해야 한다.
export default function GlobalError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ko">
      <body>
        <Theme>
          <Flex direction="column" align="center" justify="center" gap="6" className="h-screen px-6 text-center">
            <Flex direction="column" align="center" gap="2">
              <Heading variant="title3" color="text-basic">
                일시적인 오류가 발생했어요.
              </Heading>
              <Text variant="body1" color="text-subtle">
                잠시 후 다시 시도해 주세요.
              </Text>
            </Flex>
            <Flex gap="2">
              <Button variant="secondary" size="lg" onClick={() => unstable_retry()}>
                다시 시도
              </Button>
              <Button asChild variant="primary" size="lg">
                <a href="/">홈으로 이동</a>
              </Button>
            </Flex>
          </Flex>
        </Theme>
      </body>
    </html>
  )
}

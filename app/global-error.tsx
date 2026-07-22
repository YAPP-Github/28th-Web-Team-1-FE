'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

// 클라이언트 렌더링 중 발생한 에러는 window.onerror로 전파되지 않고 React 에러 바운더리가 먼저 가로채므로, Sentry에 명시적으로 보고해야 한다.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ko">
      <body>
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <p>일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.</p>
        </div>
      </body>
    </html>
  )
}

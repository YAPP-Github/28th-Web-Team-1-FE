// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import * as amplitude from '@amplitude/unified'

const amplitudeApiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY

// 개발 환경에서 Amplitude를 비활성화
if (process.env.NODE_ENV !== 'production') {
  console.warn('Amplitude disabled in non-production environment')
} else if (!amplitudeApiKey) {
  console.warn('Amplitude API key missing — analytics disabled')
} else {
  amplitude.initAll(amplitudeApiKey, { analytics: { autocapture: true }, sessionReplay: { sampleRate: 1 } })
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 프로덕션 환경에서만 Sentry 활성화
  enabled: process.env.NODE_ENV === 'production',

  // Tag events with the environment they were captured in
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely traces are sampled for performance monitoring.
  // Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Define how likely Replay events are sampled.
  // Replays 쿼터가 월 50개로 작아 무작위 세션 샘플링은 끄고, 에러 발생 시에만 기록한다.
  replaysSessionSampleRate: 0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

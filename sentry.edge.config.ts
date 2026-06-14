// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 프로덕션 환경에서만 Sentry 활성화
  enabled: process.env.NODE_ENV === 'production',

  // Tag events with the environment they were captured in
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely traces are sampled for performance monitoring.
  // Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true
})

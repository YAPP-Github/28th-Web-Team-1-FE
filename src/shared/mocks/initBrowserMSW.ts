import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

let browserMSWPromise: Promise<void> | undefined

export const initBrowserMSW = async () => {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'development') return

  browserMSWPromise ??= setupWorker(...handlers)
    .start({
      onUnhandledRequest: 'bypass'
    })
    .then(() => {
      console.log('✅ MSW 브라우저 시작됨')
    })

  await browserMSWPromise
}

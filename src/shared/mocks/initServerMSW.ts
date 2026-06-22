import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const globalForMSW = globalThis as typeof globalThis & {
  __mswServerStarted?: boolean
}

export const initServerMSW = async () => {
  if (typeof window !== 'undefined') return
  if (process.env.NODE_ENV !== 'development') return
  if (globalForMSW.__mswServerStarted) return

  setupServer(...handlers).listen({
    onUnhandledRequest: 'bypass'
  })

  globalForMSW.__mswServerStarted = true
  console.log('✅ MSW 서버 시작됨')
}

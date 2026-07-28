'use client'
import { useState } from 'react'
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Sentry from '@sentry/nextjs'
import { ApiError, AUTH_ERROR } from '@/src/shared/lib'

/**
 * GraphQL은 인증 실패도 HTTP 200으로 내려오기 때문에(status 기반 필터 불가),
 * 예상된 재인증 흐름(AUTH_ERROR)만 코드로 걸러내고 나머지는 실제 버그로 간주해 Sentry로 보낸다.
 */
const reportQueryError = (error: unknown) => {
  if (error instanceof ApiError && (error.code === AUTH_ERROR.AUTH || error.code === AUTH_ERROR.TOKEN_EXPIRED)) return
  Sentry.captureException(error)
}

const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({ onError: reportQueryError }),
    mutationCache: new MutationCache({ onError: reportQueryError }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // 3회까지 재시도, 500번대 에러만 재시도
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false
          return failureCount < 3
        }
      }
    }
  })

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* 서버 컴포넌트 렌더 중 발생한 useSuspenseQuery를 스트리밍으로 하이드레이션한다. */}
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}

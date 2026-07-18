'use client'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ApiError } from '@/src/shared/lib'

const createQueryClient = () =>
  new QueryClient({
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

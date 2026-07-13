import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

/**
 * 서버(RSC)에서 요청 단위로 재사용하는 QueryClient이다.
 * React `cache`로 감싸 같은 요청 안에서는 항상 동일 인스턴스를 반환한다.
 * prefetch 후 `dehydrate`해서 `HydrationBoundary`로 클라이언트에 넘기는 용도로 쓴다.
 */
export const getQueryClient = cache(() => new QueryClient())

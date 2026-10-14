'use client'
import { useCallback, useSyncExternalStore } from 'react'

/**
 * 미디어 쿼리 일치 여부를 구독한다. 서버·하이드레이션 중에는 알 수 없으므로 `null`을 돌려준다.
 * `null`일 때 로딩을 보여주면 첫 렌더에 다른 레이아웃이 잠깐 보였다 바뀌는 깜빡임을 막을 수 있다.
 *
 * @param query - `matchMedia`에 넘길 미디어 쿼리. 브레이크포인트는 `MEDIA_QUERY`(@shared/config)를 쓴다.
 * @returns 일치하면 `true`, 아니면 `false`, 판별 전이면 `null`
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery(MEDIA_QUERY.sm)
 * if (isDesktop === null) return <Loading />
 * ```
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query]
  )

  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null
  )
}

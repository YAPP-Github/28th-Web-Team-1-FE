'use client'
import { useEffect, useState } from 'react'

/**
 * 값이 바뀐 뒤 `delay`(ms) 동안 추가 변경이 없을 때만 갱신되는 디바운스된 값을 반환한다.
 * 검색어처럼 빠르게 바뀌는 입력을 네트워크 요청 전에 안정화할 때 사용한다.
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간(ms). 기본 300
 * @returns `delay` 동안 안정화된 값
 *
 * @example
 * ```tsx
 * const debounced = useDebounce(keyword, 300); // keyword 입력이 멈춘 뒤 300ms 후 반영
 * ```
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

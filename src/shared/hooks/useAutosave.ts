'use client'
import { useCallback, useEffect, useRef } from 'react'

/**
 * 디바운스 자동저장 훅. `schedule()`을 호출할 때마다 타이머를 리셋하고,
 * `delayMs` 동안 추가 호출이 없으면 `save`를 실행한다.
 * 대기 중인 타이머가 있을 때 `flush()`를 호출하면 기다리지 않고 즉시 저장하며,
 * 언마운트 시에도 대기 중인 저장이 남아 있으면 같은 방식으로 flush한다.
 *
 * @param save 실제 저장을 수행하는 콜백 (최신 값을 클로저로 참조)
 * @param delayMs 마지막 `schedule()` 이후 저장까지의 대기 시간(ms)
 * @returns 저장을 예약(디바운스)하는 `schedule`과, 대기 중인 저장을 즉시 실행하는 `flush`
 * @example
 * ```tsx
 * const { schedule, flush } = useAutosave(() => updateExperience(...), 8000)
 * const handleChange = (e) => {
 *   setValues(...)
 *   schedule()
 * }
 * const handleBlur = () => flush()
 * ```
 */
export const useAutosave = (save: () => void, delayMs: number) => {
  // 렌더의 최신 save를 유지해, 타이머/언마운트 시점에 stale 클로저를 저장하지 않도록 한다.
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 타이머를 정리하고, 대기 중인 저장이 있으면 즉시 실행한다.
  const flush = useCallback(() => {
    if (!timer.current) return
    clearTimeout(timer.current)
    timer.current = null
    saveRef.current()
  }, [])

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      timer.current = null
      saveRef.current()
    }, delayMs)
  }, [delayMs])

  // 언마운트(패널 닫기·경험 전환) 시 대기 중인 편집이 남아 있으면 즉시 저장한다.
  useEffect(() => flush, [flush])

  return { schedule, flush }
}

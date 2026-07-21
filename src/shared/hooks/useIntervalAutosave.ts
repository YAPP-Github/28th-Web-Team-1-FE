'use client'
import { useCallback, useEffect, useRef } from 'react'

interface UseIntervalAutosaveOptions {
  /** 저장 주기(ms). 이 간격마다 변경 여부를 확인한다. */
  intervalMs: number
  /** false면 주기 저장을 멈춘다. 기본값 true. */
  enabled?: boolean
}

/**
 * 주기 자동저장 훅. 변경 표시(`markDirty`)가 있을 때에 한해 `intervalMs`마다 `save`를 실행한다.
 * 마지막 편집 이후 일정 시간을 기다리는 디바운스({@link useAutosave})와 달리,
 * 편집이 계속돼도 주기마다 저장되므로 긴 작성 세션에서도 유실 없이 스냅샷을 남긴다.
 *
 * - 변경이 없으면 저장을 건너뛰어 불필요한 요청·캐시 무효화를 막는다.
 * - 직전 저장이 진행 중이면 이번 주기를 건너뛴다(중복 저장 방지).
 * - `save`가 실패(reject)하면 변경 표시를 되살려 다음 주기에 재시도한다.
 *
 * @param save 실제 저장을 수행하는 콜백. Promise를 반환하면 완료/실패를 추적한다.
 * @param options 주기·활성화 옵션
 * @returns 변경 발생을 알리는 `markDirty` 함수(예: 폼 `watch` 콜백에서 호출)
 * @example
 * ```tsx
 * const markDirty = useIntervalAutosave(() => saveAsync(getValues()), { intervalMs: 30_000 })
 * useEffect(() => form.watch(() => markDirty()).unsubscribe, [form, markDirty])
 * ```
 */
export const useIntervalAutosave = (save: () => void | Promise<unknown>, { intervalMs, enabled = true }: UseIntervalAutosaveOptions) => {
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  // 렌더의 최신 save를 유지해, 타이머 시점에 stale 클로저를 저장하지 않도록 한다.
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })

  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      if (!dirtyRef.current || savingRef.current) return
      dirtyRef.current = false
      savingRef.current = true
      Promise.resolve(saveRef.current())
        .catch(() => {
          dirtyRef.current = true // 실패 시 다음 주기에 재시도
        })
        .finally(() => {
          savingRef.current = false
        })
    }, intervalMs)
    return () => clearInterval(id)
  }, [enabled, intervalMs])

  return useCallback(() => {
    dirtyRef.current = true
  }, [])
}

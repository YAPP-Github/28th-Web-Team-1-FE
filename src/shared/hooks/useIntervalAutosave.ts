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
 * 자동(주기)·수동(`saveNow`) 저장이 **동일한 실행 경로**를 거친다.
 * - 변경이 없으면 주기 저장을 건너뛰어 불필요한 요청·캐시 무효화를 막는다.
 * - 저장 시작 시점에 변경 표시를 내리므로, 저장 중 발생한 편집은 다음 주기 저장 대상으로 보존된다.
 * - `save`가 실패(reject)하면 변경 표시를 되살려 다음 주기에 재시도한다.
 *
 * 요청 직렬화(겹침 방지)는 이 훅이 아니라 저장 mutation의 `scope`가 보장한다 —
 * 같은 scope의 mutation은 react-query가 순차 실행하므로, 자동·수동 저장이 동시에 나가도 겹치지 않는다.
 *
 * @param save 실제 저장을 수행하는 콜백. Promise를 반환하면 완료/실패를 추적한다.
 * @param options 주기·활성화 옵션
 * @returns `markDirty`(변경 발생 알림, 예: 폼 `watch` 콜백)와 `saveNow`(즉시 저장, 완료/실패 Promise 반환)
 * @example
 * ```tsx
 * const { markDirty, saveNow } = useIntervalAutosave(() => saveAsync(getValues()), { intervalMs: 30_000 })
 * useEffect(() => form.subscribe({ formState: { values: true }, callback: () => markDirty() }), [form, markDirty])
 * // 수동 저장 버튼: saveNow().then(...).catch(...)
 * ```
 */
export const useIntervalAutosave = (save: () => void | Promise<unknown>, { intervalMs, enabled = true }: UseIntervalAutosaveOptions) => {
  const dirtyRef = useRef(false)
  // 렌더의 최신 save를 유지해, 타이머 시점에 stale 클로저를 저장하지 않도록 한다.
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })

  // 자동·수동 공통 실행 경로. 겹침 방지는 mutation scope가 보장하므로 여기선 dirty 상태만 관리한다.
  const saveNow = useCallback((): Promise<void> => {
    dirtyRef.current = false // 저장 시작 이후의 편집만 다음 주기 대상으로 남긴다.
    return Promise.resolve()
      .then(() => saveRef.current())
      .then(() => undefined)
      .catch((error: unknown) => {
        dirtyRef.current = true // 실패 시 다음 주기에 재시도
        throw error // 수동 호출자(saveNow)가 실패를 알 수 있도록 재전파
      })
  }, [])

  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      // 변경이 있을 때만 실행하고, 자동저장 실패는 조용히 넘긴다(재시도는 saveNow 내부의 dirty 복원이 담당).
      if (dirtyRef.current) void saveNow().catch(() => {})
    }, intervalMs)
    return () => clearInterval(id)
  }, [enabled, intervalMs, saveNow])

  const markDirty = useCallback(() => {
    dirtyRef.current = true
  }, [])

  return { markDirty, saveNow }
}

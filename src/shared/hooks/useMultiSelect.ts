'use client'
import { useState } from 'react'

/**
 * 문자열 ID의 다중 선택 상태를 관리한다. 최대 `max`개까지 선택 가능하며 토글로 추가/해제한다.
 *
 * Set 불변 갱신·상한 규칙 같은 구현("어떻게")을 감추고,
 * 선택 결과와 조작 의도("무엇": selectedIds/toggle/isFull)만 노출한다.
 *
 * @param max 최대 선택 개수. 생략 시 무제한(`isFull`은 항상 false).
 */
export const useMultiSelect = (max = Infinity) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < max) next.add(id)
      return next
    })

  return {
    selectedIds: selectedIds as ReadonlySet<string>,
    toggle,
    isFull: selectedIds.size >= max
  }
}

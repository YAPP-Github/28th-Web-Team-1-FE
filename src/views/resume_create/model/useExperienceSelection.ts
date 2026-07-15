'use client'
import { useState } from 'react'

/**
 * 경험 선택 상태를 관리한다. 최대 `max`개까지 선택 가능하며 토글로 추가/해제한다.
 *
 * Set 불변 갱신·상한 규칙 같은 구현("어떻게")을 감추고,
 * 선택 결과와 조작 의도("무엇": selectedIds/toggle/isFull)만 노출한다.
 */
export const useExperienceSelection = (max: number) => {
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

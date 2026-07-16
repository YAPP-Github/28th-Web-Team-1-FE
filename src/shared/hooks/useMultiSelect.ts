'use client'
import { useState } from 'react'

/**
 * 아이템의 다중 선택 상태를 관리한다. 최대 `max`개까지 선택 가능하며 토글로 추가/해제한다.
 * `getId`로 아이템을 식별하고, 선택된 **아이템 객체**를 보관한다(호출부가 원본 리스트 없이 선택 결과를 다룰 수 있게).
 *
 * Map 불변 갱신·상한 규칙 같은 구현("어떻게")을 감추고,
 * 선택 결과와 조작 의도("무엇": selectedItems/isSelected/toggle/isFull/count)만 노출한다.
 *
 * @param getId 아이템에서 식별자를 뽑는 함수
 * @param max 최대 선택 개수. 생략 시 무제한(`isFull`은 항상 false).
 */
export const useMultiSelect = <T>(getId: (item: T) => string, max = Infinity) => {
  const [selected, setSelected] = useState<Map<string, T>>(new Map())

  const toggle = (item: T) =>
    setSelected((prev) => {
      const next = new Map(prev)
      const id = getId(item)
      if (next.has(id)) next.delete(id)
      else if (next.size < max) next.set(id, item)
      return next
    })

  return {
    selectedItems: [...selected.values()],
    isSelected: (id: string) => selected.has(id),
    toggle,
    isFull: selected.size >= max,
    count: selected.size
  }
}

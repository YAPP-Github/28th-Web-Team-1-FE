'use client'
import { useCallback, useRef } from 'react'

/** 섹션 uid로 그 섹션 아이템의 순서 변경 핸들러를 찾아 쓰는 레지스트리. */
export type ItemMoveRegistry = {
  /** 섹션 컴포넌트가 자신의 아이템 move 핸들러를 등록한다. */
  registerItemMover: (sectionUid: string, mover: (fromUid: string, toUid: string) => void) => () => void
  /** 섹션 uid로 핸들러를 찾는다. 없으면 undefined. */
  getItemMover: (sectionUid: string) => ((fromUid: string, toUid: string) => void) | undefined
}

/**
 * 미리보기 섹션별로 등록된 아이템 move 핸들러를 보관한다.
 *
 * 드래그 종료는 `DragDropProvider` 한 곳에서만 일어나지만, 실제 `move`는 경로가
 * `sections.${sectionIndex}.items`로 동적이므로 섹션마다 다른 `useFieldArray` 인스턴스가 필요하다.
 * 그래서 섹션 컴포넌트가 핸들러를 등록하고, provider가 uid로 찾아 호출한다.
 * 이렇게 하면 폼의 private 필드(`control._formValues`)에 손대지 않아도 된다.
 */
export const useItemMoveRegistry = (): ItemMoveRegistry => {
  const movers = useRef(new Map<string, (fromUid: string, toUid: string) => void>())

  const registerItemMover = useCallback((sectionUid: string, mover: (fromUid: string, toUid: string) => void) => {
    movers.current.set(sectionUid, mover)
    return () => {
      // 섹션이 언마운트되거나 uid가 바뀐 경우에만 지운다(같은 uid 재등록은 최신 핸들러를 남긴다).
      if (movers.current.get(sectionUid) === mover) movers.current.delete(sectionUid)
    }
  }, [])

  const getItemMover = useCallback((sectionUid: string) => movers.current.get(sectionUid), [])

  return { registerItemMover, getItemMover }
}

'use client'
import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import type { SectionItemWrapper } from '@widgets/resume_preview'
import type { ResumeFormValues } from '../../model/resume-form.types'
import { SortablePreviewItem } from './SortablePreviewItem'
import type { UseItemMoveRegistry } from '../../hooks/useItemMoveRegistry'

/**
 * 미리보기 섹션 하나의 아이템 드래그 정렬을 폼에 반영한다.
 *
 * `ResumeIndex`의 목차와 같은 방식을 따른다. 이 섹션이 `useFieldArray`로
 * `sections.${sectionIndex}.items`를 직접 소유하고, 이동은 `move(from, to)`로 처리한다.
 *
 * @param sectionUid 이 섹션의 uid(sortable group + 레지스트리 키로 쓴다)
 * @param sectionIndex 폼 `sections` 배열에서의 인덱스. 미리보기 표시 순번이 아니라 **폼 인덱스**를 넘겨야 한다.
 * @param registry 아이템 move 핸들러 보관소(드래그 종료 시 provider가 찾아 호출)
 * @returns 위젯 섹션 컴포넌트에 넘길 `ItemWrapper`
 */
export const useSortableSectionItems = ({ sectionUid, sectionIndex, registry }: { sectionUid: string; sectionIndex: number; registry: UseItemMoveRegistry }): SectionItemWrapper => {
  const { control, getValues } = useFormContext<ResumeFormValues>()
  const { move } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })
  const { registerItemMover } = registry

  /**
   * 출발·도착 아이템의 `uid`로 폼 배열 인덱스를 찾아 순서를 바꾼다.
   *
   * sortable 인덱스는 `visible` 필터 후 표시 순서 기준이라 그대로 쓰면 안 되고, 전체 아이템 배열에서 uid로 찾아야 한다.
   * (hidden 아이템이 섞여 있으면 표시 인덱스와 폼 인덱스가 어긋난다.)
   * `getValues`는 `move`가 이미 반영한 현재 값을 동기적으로 돌려준다.
   */
  const moveItem = useCallback(
    (fromUid: string, toUid: string) => {
      const items = getValues(`sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues>)
      const from = items.findIndex((item) => item.uid === fromUid)
      const to = items.findIndex((item) => item.uid === toUid)
      if (from === -1 || to === -1 || from === to) return

      move(from, to)
    },
    [getValues, sectionIndex, move]
  )

  useEffect(() => registerItemMover(sectionUid, moveItem), [registerItemMover, sectionUid, moveItem])

  // 래퍼 컴포넌트 타입이 렌더마다 새로 만들어지면 아이템이 전부 리마운트돼 드래그가 끊기므로 섹션 uid로 memo한다.
  return useMemo(
    () =>
      function SortableSectionItem({ uid, index, children }: { uid?: string; index: number; children: ReactNode }) {
        return (
          <SortablePreviewItem group={sectionUid} uid={uid} index={index}>
            {children}
          </SortablePreviewItem>
        )
      },
    [sectionUid]
  )
}

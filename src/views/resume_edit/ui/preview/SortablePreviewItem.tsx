'use client'
import { Flex } from '@radix-ui/themes'
import { useSortable } from '@dnd-kit/react/sortable'
import { isInSortableGroup } from '../../model/sortable'
import type { ReactNode } from 'react'

/**
 * 미리보기 아이템 하나를 sortable로 등록하는 래퍼.
 *
 * sortable id는 폼 값의 클라이언트 전용 `uid`를 쓴다. 서버 `itemId`는 신규(미저장) 아이템에서 null이라
 * 정체자로 부적합하고, `useFieldArray`의 `field.id`는 reorder 시 다른 인스턴스의 값과 어긋날 수 있다.
 *
 * sortable id는 폼 인덱스가 아니라 `group`(섹션 uid)으로 묶고, `accept`로 **같은 섹션의 아이템만** 받는다.
 * group만으로는 부족하다. droppable의 `accept`를 지정하지 않으면 모든 draggable을 받으므로, 포인터가 섹션
 * 밖(다른 섹션 아이템, 본문 여백)을 지날 때 다른 sortable이 드롭 타깃이 되어 아이템이 영역 밖으로 새게 된다.
 *
 * 드래그 중인 아이템은 반투명 처리해 어디로 떨어지는지 보이게 한다.
 *
 * @param group sortable group이 되는 섹션 uid
 * @param uid sortable id로 쓸 아이템 uid. 순수 미리보기 경로에서는 `undefined`라 정렬을 비활성화한다.
 * @param index 그룹 내 아이템 순번(현재 렌더 순서)
 */
export const SortablePreviewItem = ({ group, uid, index, children }: { group: string; uid?: string; index: number; children: ReactNode }) => {
  const { ref, isDragging } = useSortable({
    id: uid ?? '',
    index,
    group,
    disabled: uid === undefined,
    // 같은 group의 sortable만 드롭 타깃으로 받는다. 다른 섹션 아이템은 sortable이므로 group이 다르다.
    accept: (source) => isInSortableGroup(source, group)
  })

  return (
    <Flex ref={ref} direction={'column'} className={'gap-2'} data-preview-item={true} style={isDragging ? { opacity: 0.4 } : undefined}>
      {children}
    </Flex>
  )
}

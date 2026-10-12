'use client'
import { useCallback, useMemo, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { Divider, Spacing } from '@shared/ui'
import { DragDropProvider, PointerSensor } from '@dnd-kit/react'
import { PointerActivationConstraints, type Draggable } from '@dnd-kit/dom'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import { visibleItems } from '@entities/resume'
import { ResumeBasicInfoHeader, ResumeSectionView } from '@widgets/resume_preview'
import type { ResumeFormSection } from '../../model/resume-form.types'
import { isInSortableGroup } from '../../model/sortable'
import { useItemMoveRegistry, type UseItemMoveRegistry } from '../../hooks/useItemMoveRegistry'
import { CoreSkillPreviewSection } from '../CoreSkillPreviewSection'
import { useSortableSectionItems } from './useSortableSectionItems'

/**
 * 미리보기 섹션은 클릭하면 활성 섹션 이동도 함께 일어나므로, 포인터가 이 거리 이상 움직여야 드래그로 잡는다.
 * 거리가 없으면 단순 클릭이 드래그 시작으로 잡혀 클릭이 씹힌다.
 */
const PREVIEW_DRAG_ACTIVATION_DISTANCE = 8

/**
 * 아이템 위에서 시작한 포인터는 섹션 드래그로 잡지 않는다.
 *
 * 섹션 래퍼는 아이템을 감싸고 있어 두 sortable의 요소가 겹친다. 포인터 이벤트는 조상으로 새므로
 * 아이템 sortable만 반응해야 하는데, 이 판단이 없으면 섹션 sortable도 함께 잡혀 섹션 전체가 끌려간다.
 *
 * 아이템 sortable(`group`이 섹션 uid인 것)은 통과시키고, 섹션 sortable만 차단한다.
 * 아이템 요소에 심은 `data-preview-item` 표시로 판정하므로 sortable 등록 상태를 따로 들여다볼 필요가 없다.
 */
const preventActivation = (event: PointerEvent, source: Draggable) => {
  // sortable 그룹에 속하지 않는(섹션) draggable만 검사 대상이다. 아이템 sortable은 통과시켜야 한다.
  if (!isInSortableGroup(source, undefined)) return false
  return event.target instanceof Element && event.target.closest('[data-preview-item]') !== null
}

interface ResumePreviewProps {
  /** 폼의 전체 `sections` 배열. 미리보기에 필요한 값(BASIC_INFO 헤더, 본문 섹션 목록)을 여기서 파생한다. */
  sections: ResumeFormSection[]
  activeSectionUid: string | null
  onSelectSection: (sectionUid: string, itemUid?: string) => void
  /** 미리보기 섹션 드래그가 끝나면 폼 순서를 바꿔주는 핸들러. 출발·도착 섹션의 `uid`를 받는다. */
  onSectionMove: (fromUid: string, toUid: string) => void
  registerSectionRef: (uid: string, el: HTMLElement | null) => void
}

export const ResumePreview = ({ sections, activeSectionUid, onSelectSection, onSectionMove, registerSectionRef }: ResumePreviewProps) => {
  const basicInfoSection = sections.find((section) => section.type === 'BASIC_INFO') ?? null
  const basicInfo = basicInfoSection?.items[0]?.payload.basicInfo ?? null

  /**
   * 미리보기 본문 섹션과 **폼 인덱스**의 쌍.
   *
   * 미리보기에 노출할 섹션만 거르려면 `visible`·`BASIC_INFO` 필터가 필요한데, 필터한 뒤의 순번은
   * 폼 `sections` 배열 인덱스와 어긋난다(숨김 섹션이 하나라도 있으면). 아이템 정렬의 field array 경로
   * `sections.${formIndex}.items`가 이 값에 의존하므로, **필터하기 전에** 폼 인덱스를 붙여 둔다.
   */
  const bodyEntries = useMemo(() => sections.map((section, formIndex) => ({ section, formIndex })).filter(({ section }) => section.visible && section.type !== 'BASIC_INFO'), [sections])

  const itemMoveRegistry = useItemMoveRegistry()

  return (
    <Flex align={'center'} className={'bg-bg-gray-subtler relative flex-1'}>
      <Flex direction={'column'} className={'bg-bg-white mx-auto h-[calc(100%-2rem)] w-149 min-w-149 overflow-y-auto p-7'}>
        {basicInfoSection ? (
          <SelectableArea sectionUid={basicInfoSection.uid} activeSectionUid={activeSectionUid} onSelect={onSelectSection} registerRef={registerSectionRef}>
            <ResumeBasicInfoHeader basicInfo={basicInfo} />
          </SelectableArea>
        ) : (
          <ResumeBasicInfoHeader basicInfo={basicInfo} />
        )}

        <Spacing size={12} />
        <Divider color={'gray-10'} />
        <Spacing size={12} />

        <DragDropProvider
          sensors={[PointerSensor.configure({ activationConstraints: [new PointerActivationConstraints.Distance({ value: PREVIEW_DRAG_ACTIVATION_DISTANCE })], preventActivation })]}
          onDragEnd={({ operation, canceled }) => {
            if (canceled) return

            // Optimistic Sorting 때문에 source와 target은 항상 같은 엘리먼트를 가리킨다.
            // 이동 여부는 sortable이 관리하는 인덱스 변화로만 판별할 수 있다.
            const { source } = operation
            if (!isSortable(source)) return

            const { id, initialIndex, index, group } = source
            if (initialIndex === index) return

            // 아이템 드래그(group = 섹션 uid)는 그 섹션이 등록한 핸들러에 위임한다.
            if (typeof group === 'string') {
              const entry = bodyEntries.find((candidate) => candidate.section.uid === group)
              if (!entry) return

              const targetItem = visibleItems(entry.section)[index]
              if (!targetItem?.uid) return

              // `accept`가 같은 그룹만 받도록 막아 두었지만, 방어적으로 도착 아이템의 소속을 한 번 더 확인한다.
              // 다른 섹션의 아이템으로 잘못 옮기면 섹션 밖에서 순서가 뒤바뀐 채 저장된다.
              if (targetItem.uid === id) return
              itemMoveRegistry.getItemMover(group)?.(String(id), targetItem.uid)
              return
            }

            // 섹션 드래그: 도착 인덱스 위치에 있는 섹션의 uid를 넘긴다(인덱스 좌표계 변환을 상위에 맡기지 않는다).
            const targetSection = bodyEntries[index]?.section
            if (!targetSection) return
            onSectionMove(String(id), targetSection.uid)
          }}
        >
          <Flex direction={'column'} gap="5">
            {bodyEntries.map(({ section, formIndex }, index) => (
              <SortablePreviewSection
                key={section.uid}
                section={section}
                index={index}
                sectionIndex={formIndex}
                activeSectionUid={activeSectionUid}
                onSelect={onSelectSection}
                registerRef={registerSectionRef}
                itemMoveRegistry={itemMoveRegistry}
              />
            ))}
          </Flex>
        </DragDropProvider>
      </Flex>
    </Flex>
  )
}

interface SortablePreviewSectionProps {
  section: ResumeFormSection
  /** 드래그 가능한 미리보기 본문에서의 순번. Optimistic Sorting의 위치 계산에 쓴다. */
  index: number
  /** 폼 `sections` 배열에서의 인덱스. 아이템 field array 경로(`sections.${sectionIndex}.items`)에 쓰인다. */
  sectionIndex: number
  activeSectionUid: string | null
  onSelect: (sectionUid: string, itemUid?: string) => void
  /** 미니맵 스크롤용 DOM 등록 ref. */
  registerRef: (uid: string, el: HTMLElement | null) => void
  itemMoveRegistry: UseItemMoveRegistry
}

/**
 * 미리보기 본문 섹션 하나. 섹션 순서 DnD와 아이템 순서 DnD를 함께 담당한다.
 *
 * 아이템 정렬 래퍼는 `useSortableSectionItems`가 이 섹션의 폼 경로(`sections.${sectionIndex}.items`)에 묶어 만든다.
 * 경로가 동적이라 섹션마다 훅 인스턴스가 하나씩 필요하다.
 *
 * `index`(미리보기 순번)와 `sectionIndex`(폼 순번)는 다르다. 미리보기는 `visible`이거나 `BASIC_INFO`가 아닌
 * 섹션만 노출하므로, 숨김 섹션이 하나라도 있으면 둘이 어긋난다. 아이템 field array 경로에는 반드시
 * `sectionIndex`를 써야 다른 섹션의 items를 건드리지 않는다.
 *
 * `CORE_SKILL`은 아이템 순서 변경이 불필요해 DnD를 지원하지 않는다. 핵심역량 단락은 나열 순서가 의미를 갖지 않고,
 * AI가 만든 단락을 임의로 옮기는 것이 오히려 거슬리므로 위젯에 래퍼를 넘기지 않아 원래 마크업으로 렌더한다.
 * (섹션 자체의 순서 변경은 다른 섹션과 동일하게 지원한다.)
 */
const SortablePreviewSection = ({ section, index, sectionIndex, activeSectionUid, onSelect, registerRef, itemMoveRegistry }: SortablePreviewSectionProps) => {
  const itemWrapper = useSortableSectionItems({ sectionUid: section.uid, sectionIndex, registry: itemMoveRegistry })

  return (
    <SortableSelectableArea sectionUid={section.uid} index={index} activeSectionUid={activeSectionUid} onSelect={onSelect} registerRef={registerRef}>
      {section.type === 'CORE_SKILL' ? <CoreSkillPreviewSection section={section} /> : <ResumeSectionView section={section} ItemWrapper={itemWrapper} />}
    </SortableSelectableArea>
  )
}

interface SelectableAreaProps {
  sectionUid: string
  activeSectionUid: string | null
  onSelect: (sectionUid: string, itemUid?: string) => void
  registerRef: (uid: string, el: HTMLElement | null) => void
  children: ReactNode
}

/** Enter/Space로 활성 섹션을 선택하는 공통 키보드 핸들러. */
const selectOnKeyDown = (select: () => void) => (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  select()
}

/** 클릭 지점에서 가장 가까운 아이템 래퍼(`data-item-uid`)를 찾는다. 섹션 여백을 클릭하면 undefined. */
const itemUidFromEvent = (event: MouseEvent<HTMLDivElement>): string | undefined => {
  const target = event.target
  return target instanceof Element ? (target.closest('[data-item-uid]')?.getAttribute('data-item-uid') ?? undefined) : undefined
}

/** 미리보기에서 클릭·키보드로 활성 섹션을 선택할 수 있게 감싸는 래퍼. `data-active`를 자식(Section)의 group-data 스타일이 읽는다. 미니맵 스크롤 이동을 위해 자기 DOM을 uid로 등록한다. */
const SelectableArea = ({ sectionUid, activeSectionUid, onSelect, registerRef, children }: SelectableAreaProps) => {
  const select = (event?: MouseEvent<HTMLDivElement>) => onSelect(sectionUid, event ? itemUidFromEvent(event) : undefined)

  return (
    <div
      ref={(el) => registerRef(sectionUid, el)}
      role="button"
      tabIndex={0}
      data-active={activeSectionUid === sectionUid}
      onClick={select}
      onKeyDown={selectOnKeyDown(() => onSelect(sectionUid))}
      className={'group cursor-pointer rounded-sm outline-none'}
    >
      {children}
    </div>
  )
}

interface SortableSelectableAreaProps extends SelectableAreaProps {
  /**
   * 정렬 그룹(드래그 가능한 미리보기 본문) 안에서의 순번. 0부터 시작한다.
   * 서버 `displayOrder`와 무관하게 **현재 렌더 순서**를 써야 OptimisticSorting의 위치 계산이 맞는다.
   */
  index: number
}

/**
 * 드래그로 순서를 바꿀 수 있는 미리보기 섹션 래퍼. 선택·하이라이트 동작은 {@link SelectableArea}와 같고,
 * sortable 등록과 DOM 등록(ref 병합)만 추가된다. 기본정보 헤더처럼 순서를 바꿀 수 없는 영역은 `SelectableArea`를 쓴다.
 *
 * `accept`로 **섹션 sortable만** 드롭 타깃으로 받는다. 이 래퍼는 하위 아이템을 감싸고 있어, 지정하지 않으면
 * 아이템을 드래그할 때 그 섹션이 타깃으로 잡혀 섹션과 아이템이 서로 자리를 바꾸게 된다.
 */
const SortableSelectableArea = ({ sectionUid, index, activeSectionUid, onSelect, registerRef, children }: SortableSelectableAreaProps) => {
  const select = (event?: MouseEvent<HTMLDivElement>) => onSelect(sectionUid, event ? itemUidFromEvent(event) : undefined)
  const { ref } = useSortable({ id: sectionUid, index, accept: (source) => isInSortableGroup(source, undefined) })

  // sortable 등록 ref와 미니맵 스크롤용 DOM 등록 ref를 하나의 ref로 병합한다.
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      ref(el)
      registerRef(sectionUid, el)
    },
    [ref, registerRef, sectionUid]
  )

  return (
    <div
      ref={setRef}
      role="button"
      tabIndex={0}
      data-active={activeSectionUid === sectionUid}
      onClick={select}
      onKeyDown={selectOnKeyDown(select)}
      className={'group cursor-pointer rounded-sm outline-none'}
    >
      {children}
    </div>
  )
}

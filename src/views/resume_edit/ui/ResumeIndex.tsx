'use client'
import { Fragment, useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Divider, Text } from '@shared/ui'
import { Menu, Settings } from 'lucide-react'
import { getItemLabel, visibleItems } from '../model/section'
import type { ResumeFormSection, ResumeFormValues } from '../model/resume-form.types'

/** 섹션·아이템 이동 종료 이벤트를 fieldArray move 인덱스로 옮기는 공통 핸들러 생성기. */
const makeDragEndHandler = (fieldIds: string[], move: (from: number, to: number) => void) => (event: DragEndEvent) => {
  const { active, over } = event
  if (!over || active.id === over.id) return
  const from = fieldIds.indexOf(String(active.id))
  const to = fieldIds.indexOf(String(over.id))
  if (from !== -1 && to !== -1) move(from, to)
}

/**
 * 이력서 미리보기의 목차(minimap). 폼 `sections` 배열 순서를 그대로 반영하고, 펼친 패널에서
 * 드래그앤드롭으로 순서를 바꾼다. (섹션은 섹션끼리, 아이템은 같은 섹션 안에서)
 */
export const ResumeIndex = ({ activeSectionId }: { activeSectionId: string | null }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields: sectionFields, move: moveSection } = useFieldArray({ control, name: 'sections' })
  const sections = useWatch({ control, name: 'sections' }) ?? []
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const bodyEntries = sectionFields
    .map((field, index) => ({ id: field.id, index, section: sections[index] }))
    .filter((e): e is { id: string; index: number; section: ResumeFormSection } => Boolean(e.section) && e.section.visible && e.section.type !== 'BASIC_INFO')

  const basicInfoSectionId = sections.find((section) => section?.type === 'BASIC_INFO')?.sectionId ?? null
  const activeEntry = activeId ? (bodyEntries.find((e) => e.id === activeId) ?? null) : null
  const handleSectionDragEnd = makeDragEndHandler(
    bodyEntries.map((e) => e.id),
    (from, to) => moveSection(bodyEntries[from].index, bodyEntries[to].index)
  )

  return (
    <Flex className={'bg-bg-gray-subtler relative w-16 px-4 py-20'} onMouseLeave={() => setIsOpen(false)}>
      <Flex direction="column" align={'end'} gap="2" className="h-fit w-full" onMouseEnter={() => setIsOpen(true)}>
        {basicInfoSectionId && <div className={cn('h-0.75 w-6 rounded-full', activeSectionId === basicInfoSectionId ? 'bg-border-primary' : 'bg-border-subtle')} />}
        {bodyEntries.map(({ id, section }) => {
          const isActive = activeSectionId === section.sectionId
          return (
            <Fragment key={id}>
              <div className={cn('h-0.75 w-6 rounded-full', isActive ? 'bg-border-primary' : 'bg-border-subtle')} />
              {visibleItems(section).map((item, itemIndex) => (
                <div key={item.itemId ?? itemIndex} className={cn('h-0.75 w-4 rounded-full', isActive ? 'bg-border-primary' : 'bg-border-subtle')} />
              ))}
            </Fragment>
          )
        })}
      </Flex>

      {isOpen && (
        <Flex direction="column" className={cn('bg-element-white border-border-subtler shadow-1 absolute top-16 right-4 z-10 w-55.5 gap-1.5 rounded-lg border px-5 py-3')}>
          <Flex align={'center'} className={cn('rounded-sm px-1.5 py-1', activeSectionId === basicInfoSectionId && 'bg-element-primary-lighter')}>
            <Text variant="label2" color={'text-subtler'}>
              기본정보
            </Text>
          </Flex>

          <Divider />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragStart={(e) => setActiveId(String(e.active.id))}
            onDragEnd={(e) => {
              handleSectionDragEnd(e)
              setActiveId(null)
            }}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={bodyEntries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              <Flex direction="column" className={'-ml-4 max-h-130 gap-1.5 overflow-y-auto pl-4'}>
                {bodyEntries.map(({ id, index, section }) => (
                  <SortableSectionRow key={id} id={id} sectionIndex={index} section={section} isActive={activeSectionId === section.sectionId} />
                ))}
              </Flex>
            </SortableContext>

            {/* 드래그 중인 섹션을 리스트 흐름에서 떼어내 떠 있는 복제본으로 렌더 → 높이 차로 인한 뭉개짐 방지 */}
            <DragOverlay>{activeEntry ? <SectionDragOverlay section={activeEntry.section} /> : null}</DragOverlay>
          </DndContext>

          <Divider />

          <Button
            variant={'text'}
            size={'xs'}
            className={'ml-auto'}
            onClick={() => {
              // Todo: 카테고리 추가/삭제 모달 열기
            }}
          >
            카테고리 추가/삭제 <Settings />
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

/** 정렬 가능한 섹션 행. grip을 드래그 핸들로 쓰고, 내부에 같은 섹션 아이템용 중첩 DnD를 둔다. */
const SortableSectionRow = ({ id, sectionIndex, section, isActive }: { id: string; sectionIndex: number; section: ResumeFormSection; isActive: boolean }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields: itemFields, move: moveItem } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })

  const itemEntries = itemFields
    .map((field, index) => ({ id: field.id, item: section.items[index] }))
    .filter((e): e is { id: string; item: ResumeFormSection['items'][number] } => Boolean(e.item) && e.item.visible)

  const handleItemDragEnd = makeDragEndHandler(
    itemFields.map((f) => f.id),
    moveItem
  )

  return (
    <Flex
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : undefined }}
      direction="column"
      className={cn(
        'active:border-border-primary-light active:bg-element-white rounded-sm border border-transparent has-[[data-item]:active]:border-transparent',
        isActive ? 'bg-element-primary-lighter has-[[data-item]:active]:bg-element-primary-lighter' : 'has-[[data-item]:active]:bg-transparent'
      )}
    >
      <Flex align={'center'} className={'group/section relative'}>
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={'text-icon-gray absolute top-1.75 right-full mr-0.5 cursor-grab opacity-0 transition-opacity group-hover/section:opacity-100'}
        >
          <Menu size={12} />
        </button>

        <Text variant="label2" color={'text-subtler'} className={'w-full truncate px-1.5 py-1'}>
          {section.displayText}
        </Text>
      </Flex>

      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleItemDragEnd}>
        <SortableContext items={itemEntries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <Flex direction="column" gap="1" className={'rounded-sm'}>
            {itemEntries.map((e) => (
              <SortableItemRow key={e.id} id={e.id} label={getItemLabel(e.item)} />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  )
}

/** DragOverlay용 섹션 미리보기(정적). 실제 크기 그대로 떠서 이동하므로 높이 차와 무관하게 깔끔하다. */
const SectionDragOverlay = ({ section }: { section: ResumeFormSection }) => {
  return (
    <Flex direction="column" className={'bg-element-white border-border-subtler shadow-1 w-full rounded-sm border'}>
      <Flex align={'center'} className={'relative'}>
        <Menu size={12} className={'text-icon-gray absolute top-1.75 right-full mr-0.5'} />
        <Text variant="label2" color={'text-subtler'} className={'w-full truncate px-1.5 py-1'}>
          {section.displayText}
        </Text>
      </Flex>
      <Flex direction="column" gap="1">
        {visibleItems(section).map((item, index) => (
          <Flex key={index} align={'center'} gap={'1'} className={'p-1'}>
            <Menu size={12} className={'text-icon-gray shrink-0'} />
            <Text variant="caption2" color="text-subtler" className="w-full truncate">
              {getItemLabel(item)}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

/** 정렬 가능한 아이템 행. grip을 드래그 핸들로 쓴다. */
const SortableItemRow = ({ id, label }: { id: string; label: string }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : undefined }

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      data-item
      align={'center'}
      gap={'1'}
      className={cn('group/item active:border-border-primary-light active:bg-element-white rounded-sm border border-transparent p-1')}
    >
      <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} className={'text-icon-gray shrink-0 cursor-grab opacity-0 transition-opacity group-hover/item:opacity-100'}>
        <Menu size={12} />
      </button>

      <Text variant="caption2" color="text-subtler" className="w-full truncate">
        {label}
      </Text>
    </Flex>
  )
}

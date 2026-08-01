'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Menu, Plus, Settings, X } from 'lucide-react'
import type { ResumeSectionType } from '@shared/lib/gql/graphql'
import { getItemLabel, visibleItems } from '@entities/resume'
import { ADDABLE_CATEGORY_TYPES, createCategorySection, SECTION_CATEGORY_LABELS } from '../model/category'
import type { ResumeFormSection, ResumeFormValues } from '../model/resume-form.types'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { AnimatePresence, motion } from 'motion/react'

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
export const ResumeIndex = ({ activeSectionUid, onSelectSection }: { activeSectionUid: string | null; onSelectSection: (sectionUid: string) => void }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields: sectionFields, move: moveSection } = useFieldArray({ control, name: 'sections' })
  const sections = useWatch({ control, name: 'sections' }) ?? []
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  const bodyEntries = sectionFields
    .map((field, index) => ({ id: field.id, index, section: sections[index] }))
    .filter((e): e is { id: string; index: number; section: ResumeFormSection } => Boolean(e.section) && e.section.visible && e.section.type !== 'BASIC_INFO')

  const basicInfoSectionUid = sections.find((section) => section?.type === 'BASIC_INFO')?.uid ?? null
  const activeEntry = activeId ? (bodyEntries.find((e) => e.id === activeId) ?? null) : null
  const handleSectionDragEnd = makeDragEndHandler(
    bodyEntries.map((e) => e.id),
    (from, to) => moveSection(bodyEntries[from].index, bodyEntries[to].index)
  )

  const containerRef = useRef<HTMLDivElement>(null)

  // 실제로 마우스가 얹혀 있거나(이미 얹힌 채 로드된 경우 포함) 드래그 중이면 닫지 않는다.
  useEffect(() => {
    const id = setTimeout(() => {
      const isHovering = containerRef.current?.matches(':hover')
      if (!isHovering) setIsOpen(false)
    }, 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <Flex
      ref={containerRef}
      className={'bg-bg-gray-subtler relative w-16 px-4 py-20'}
      onMouseLeave={() => {
        setIsOpen(false)
      }}
    >
      <Flex direction="column" align={'end'} gap="2" className="h-fit w-full" onMouseEnter={() => setIsOpen(true)}>
        {basicInfoSectionUid && <div className={cn('h-0.75 w-6 rounded-full', activeSectionUid === basicInfoSectionUid ? 'bg-border-primary' : 'bg-border-subtle')} />}
        {bodyEntries.map(({ id, section }) => {
          const isActive = activeSectionUid === section.uid
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

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={'bg-element-white absolute top-16 right-4 h-2 w-2 rotate-45'} />
            <Flex direction="column" className={cn('bg-element-white border-border-subtler shadow-1 absolute top-16 right-4 z-10 w-55.5 gap-1.5 rounded-lg border px-5 py-3')}>
              <button
                type="button"
                onClick={() => basicInfoSectionUid && onSelectSection(basicInfoSectionUid)}
                className={cn('flex w-full cursor-pointer items-center rounded-sm px-1.5 py-1 text-left', activeSectionUid === basicInfoSectionUid && 'bg-element-primary-lighter')}
              >
                <Text variant="label2" color={'text-subtler'}>
                  기본정보
                </Text>
              </button>

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
                      <SortableSectionRow key={id} id={id} sectionIndex={index} section={section} isActive={activeSectionUid === section.uid} onSelect={() => onSelectSection(section.uid)} />
                    ))}
                  </Flex>
                </SortableContext>

                {/* 드래그 중인 섹션을 리스트 흐름에서 떼어내 떠 있는 복제본으로 렌더 → 높이 차로 인한 뭉개짐 방지 */}
                <DragOverlay>{activeEntry ? <SectionDragOverlay section={activeEntry.section} /> : null}</DragOverlay>
              </DndContext>

              <Divider />

              <SetCategoryModal />
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}

/** 정렬 가능한 섹션 행. grip을 드래그 핸들로 쓰고, 내부에 같은 섹션 아이템용 중첩 DnD를 둔다. */
const SortableSectionRow = ({ id, sectionIndex, section, isActive, onSelect }: { id: string; sectionIndex: number; section: ResumeFormSection; isActive: boolean; onSelect: () => void }) => {
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
      <Flex align={'center'} className={'group/section relative cursor-pointer'} onClick={onSelect}>
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={
            'active:bg-element-gray-lighter hover:bg-element-gray-lighter text-icon-gray absolute top-1.25 right-full -translate-x-0.5 cursor-grab rounded-xs p-0.5 opacity-0 transition-opacity outline-none group-hover/section:opacity-100'
          }
        >
          <Menu size={12} />
        </button>

        <Text variant="label2" color={'text-subtler'} className={'w-full truncate px-1.5 py-1'}>
          {SECTION_CATEGORY_LABELS[section.type]}
        </Text>
      </Flex>

      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleItemDragEnd}>
        <SortableContext items={itemEntries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <Flex direction="column" gap="1" className={'rounded-sm'}>
            {itemEntries.map((e) => (
              <SortableItemRow key={e.id} id={e.id} label={getItemLabel(e.item)} onSelect={onSelect} />
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
    <Flex direction="column" className={'bg-element-white border-border-primary-light shadow-1 w-full rounded-sm border'}>
      <Flex align={'center'} className={'relative'}>
        <div className={'bg-element-gray-light text-icon-gray absolute top-1.25 right-full -translate-x-0.5 rounded-xs p-0.5'}>
          <Menu size={12} />
        </div>

        <Text variant="label2" color={'text-subtler'} className={'w-full truncate px-1.5 py-1'}>
          {SECTION_CATEGORY_LABELS[section.type]}
        </Text>
      </Flex>
      <Flex direction="column" gap="1">
        {visibleItems(section).map((item, index) => (
          <Flex key={index} align={'center'} gap={'1'} className={cn('group/item active:border-border-primary-light active:bg-element-white rounded-sm border border-transparent p-1')}>
            <div className={'shrink-0 p-0.5 opacity-0'}>
              <Menu size={12} />
            </div>
            <Text variant="caption2" color="text-subtler" className="w-full truncate">
              {getItemLabel(item)}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

/** 정렬 가능한 아이템 행. grip을 드래그 핸들로 쓰고, 행을 클릭하면 부모 섹션으로 포커스를 옮긴다. */
const SortableItemRow = ({ id, label, onSelect }: { id: string; label: string; onSelect: () => void }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : undefined }

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      data-item
      align={'center'}
      gap={'1'}
      onClick={onSelect}
      className={cn('group/item active:border-border-primary-light active:bg-element-white cursor-pointer rounded-sm border border-transparent p-1')}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={'hover:bg-element-gray-lighter text-icon-gray shrink-0 cursor-grab rounded-xs p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100'}
      >
        <Menu size={12} />
      </button>
      <Text variant="caption2" color="text-subtler" className="w-full truncate">
        {label}
      </Text>
    </Flex>
  )
}

/**
 * "카테고리 추가/삭제" 모달. 어떤 섹션 카테고리를 이력서에 둘지 관리한다.
 * - 좌측: 현재 추가된 카테고리(X로 삭제). 기본정보는 필수라 삭제 불가.
 * - 우측: 빠져 있는(추가 가능한) 카테고리(＋로 추가).
 * 변경은 로컬에 스테이징되고 **저장**을 눌러야 폼에 반영된다(닫으면 취소).
 * 삭제한 기존 섹션은 세션 내 pool에 보관해 재추가 시 데이터를 그대로 복원한다.
 */
/**
 * "카테고리 추가/삭제" 모달. 어떤 섹션 카테고리를 이력서에 노출할지 관리한다.
 * 삭제는 실제 제거가 아니라 visible 토글이라 데이터가 보존된다.
 * - X(삭제): 기존 섹션은 `visible:false`(숨김·보존), 이번 세션에 새로 만든 미저장 섹션은 완전 제거
 * - ＋(추가): 숨겨둔 기존 섹션은 `visible:true`, 이력서에 없던 타입은 새 섹션 생성
 * 변경은 로컬에 스테이징되고 **저장**을 눌러야 폼에 반영된다(닫으면 취소).
 */
const SetCategoryModal = () => {
  const { control, getValues } = useFormContext<ResumeFormValues>()
  const { replace } = useFieldArray({ control, name: 'sections' })

  const [isOpen, setIsOpen] = useState(false)
  const [staged, setStaged] = useState<ResumeFormSection[]>([])

  const openModal = () => {
    setStaged(getValues('sections').filter((section) => section.type !== 'BASIC_INFO'))
    setIsOpen(true)
  }

  const setVisible = (uid: string, visible: boolean) => {
    setStaged((prev) => prev.map((section) => (section.uid === uid ? { ...section, visible } : section)))
  }

  const removeCategory = (uid: string) => {
    setStaged((prev) => {
      const target = prev.find((section) => section.uid === uid)
      // 미저장 신규 섹션은 숨겨봐야 빈 섹션만 생기므로 완전 제거, 기존 섹션은 숨김으로 보존.
      if (target && target.sectionId === null) return prev.filter((section) => section.uid !== uid)
      return prev.map((section) => (section.uid === uid ? { ...section, visible: false } : section))
    })
  }

  const addNewType = (type: ResumeSectionType) => {
    setStaged((prev) => [...prev, createCategorySection(type, prev)])
  }

  const handleSave = () => {
    const fixed = getValues('sections').filter((section) => section.type === 'BASIC_INFO')
    replace([...fixed, ...staged])
    setIsOpen(false)
  }

  const visibleSections = staged.filter((section) => section.visible)
  const hiddenSections = staged.filter((section) => !section.visible)
  const missingTypes = ADDABLE_CATEGORY_TYPES.filter((type) => !staged.some((section) => section.type === type))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'text'} size={'xs'} className={'ml-auto'} onClick={openModal}>
          카테고리 추가/삭제 <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-157 w-110 flex-col gap-0">
        <DialogTitle asChild>
          <Text variant="headline2">이력서 카테고리 추가/삭제</Text>
        </DialogTitle>
        <DialogDescription asChild>
          <Text variant="body2" color={'text-subtler'}>
            이력서에 포함할 항목을 관리할 수 있어요.
          </Text>
        </DialogDescription>

        <Spacing size={20} />

        <Flex gap="4" className="min-h-0 flex-1">
          <Flex direction="column" gap="2" className="min-h-0 w-1/2 overflow-y-auto">
            <Flex justify={'between'} gap="2" className={'bg-element-gray-lighter shrink-0 rounded-sm px-3 py-2.5'}>
              <Text variant="label1">기본정보</Text>
              <Text variant="label2" color={'text-primary-basic'}>
                필수
              </Text>
            </Flex>
            {visibleSections.map((section) => (
              <Flex
                key={section.uid}
                asChild
                align={'center'}
                justify={'between'}
                gap={'2'}
                className={cn('group bg-element-gray-lighter shrink-0 cursor-pointer rounded-sm border border-transparent px-3 py-2.5', 'hover:border-border-subtler hover:shadow-1')}
              >
                <button type="button" onClick={() => removeCategory(section.uid)}>
                  <Text variant="label1" className={'text-text-subtle group-hover:text-text-basic'}>
                    {SECTION_CATEGORY_LABELS[section.type]}
                  </Text>
                  <X size={16} className={'text-icon-gray-light group-hover:text-icon-gray'} />
                </button>
              </Flex>
            ))}
          </Flex>

          <Divider orientation="vertical" />

          {hiddenSections.length === 0 && missingTypes.length === 0 ? (
            <Text as={'p'} variant={'label1'} color={'text-subtler'} className="m-auto w-1/2 text-center whitespace-pre-line">
              {` 모든 항목이 \n  추가되어 있어요`}
            </Text>
          ) : (
            <Flex direction="column" gap="2" className="min-h-0 w-1/2 overflow-y-auto">
              {hiddenSections.map((section) => (
                <Flex key={section.uid} asChild justify={'between'} align={'center'} gap="2" className={'group shrink-0 cursor-pointer rounded-sm border border-dashed px-3 py-2.5'}>
                  <button type="button" onClick={() => setVisible(section.uid, true)}>
                    <Text variant="label1" className={'text-text-subtler group-hover:text-text-basic'}>
                      {SECTION_CATEGORY_LABELS[section.type]}
                    </Text>
                    <Plus size={16} className={'text-icon-gray-light group-hover:text-icon-gray'} />
                  </button>
                </Flex>
              ))}

              {missingTypes.map((type) => (
                <Flex key={type} asChild justify={'between'} align={'center'} gap="2" className={'group shrink-0 cursor-pointer rounded-sm border border-dashed px-3 py-2.5'}>
                  <button type="button" onClick={() => addNewType(type)}>
                    <Text variant="label1" className={'text-text-subtler group-hover:text-text-basic'}>
                      {SECTION_CATEGORY_LABELS[type]}
                    </Text>
                    <Plus size={16} className={'text-icon-gray-light group-hover:text-icon-gray'} />
                  </button>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>

        <Spacing size={24} />

        <Button onClick={handleSave}>저장</Button>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import { useState } from 'react'
import { useFormContext, type UseFieldArrayReplace } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Diff, Plus, X } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip'
import { cn } from '@shared/lib/cn'
import type { ResumeSectionType } from '@shared/lib/gql/graphql'
import { ADDABLE_CATEGORY_TYPES, createCategorySection, SECTION_CATEGORY_LABELS } from '../model/category'
import type { ResumeFormSection, ResumeFormValues } from '../model/resume-form.types'

/**
 * "카테고리 추가/삭제" 모달. 어떤 섹션 카테고리를 이력서에 노출할지 관리한다.
 * 삭제는 실제 제거가 아니라 visible 토글이라 데이터가 보존된다.
 * - X(삭제): 기존 섹션은 `visible:false`(숨김·보존), 이번 세션에 새로 만든 미저장 섹션은 완전 제거
 * - ＋(추가): 숨겨둔 기존 섹션은 `visible:true`, 이력서에 없던 타입은 새 섹션 생성
 * 변경은 로컬에 스테이징되고 **저장**을 눌러야 폼에 반영된다(닫으면 취소).
 */
const SetCategoryModal = ({ onReplaceSections }: { onReplaceSections: UseFieldArrayReplace<ResumeFormValues, 'sections'> }) => {
  const { getValues } = useFormContext<ResumeFormValues>()

  const [isOpen, setIsOpen] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [staged, setStaged] = useState<ResumeFormSection[]>([])

  const openModal = () => {
    setStaged(getValues('sections').filter((section) => section.type !== 'BASIC_INFO'))
    setIsTooltipOpen(false)
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
    onReplaceSections([...fixed, ...staged])
    setIsOpen(false)
  }

  const visibleSections = staged.filter((section) => section.visible)
  const hiddenSections = staged.filter((section) => !section.visible)
  const missingTypes = ADDABLE_CATEGORY_TYPES.filter((type) => !staged.some((section) => section.type === type))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip open={isTooltipOpen && !isOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'icon-md'} className={'shadow-2 text-text-subtler rounded-full bg-white'} onClick={openModal} aria-label={'카테고리 추가/삭제'}>
              <Diff />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side={'right'} sideOffset={8}>
          카테고리 추가/삭제
        </TooltipContent>
      </Tooltip>

      <DialogContent className="flex h-157 w-110 flex-col gap-0" onCloseAutoFocus={(event) => event.preventDefault()}>
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

export { SetCategoryModal }

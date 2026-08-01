import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text, Button } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { cn } from '@shared/lib/cn'
import { Check, ChevronDown, X } from 'lucide-react'
import { SKILL_LEVEL_LABELS, SKILL_LEVEL_OPTIONS, type SelectOption } from '@entities/profile'
import type { SkillLevel } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

export const SkillSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  // 기술 칩은 상단 입력으로 새로 만들어 append하는 방식이라, 입력 중인 값은 폼이 아닌 로컬 상태로 둔다.
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    append({ itemId: null, displayOrder: nextDisplayOrder(fields), visible: true, payload: { ...emptyItemPayload, skill: { name: name.trim(), level: level.trim() || null } } })
    setName('')
    setLevel('')
  }

  return (
    <Section title={title}>
      <Flex className={'gap-5'} direction={'column'}>
        <Flex flexBasis={'1'} gap={'1'} align={'end'}>
          <Flex className={'w-full'} gap={'1'}>
            <Input label={'기술/도구'} placeholder={'기술명 또는 도구명'} className={'w-6/10'} value={name} onChange={(e) => setName(e.target.value)} />
            <SkillLevelSelect label={'숙련도'} placeholder={'선택 안 함'} className={'w-4/10'} value={level} onChange={setLevel} />
          </Flex>
          <Button variant={'secondary'} size={'sm'} className={'h-11.75'} onClick={handleAdd}>
            추가
          </Button>
        </Flex>

        <Flex gap={'1'} wrap={'wrap'}>
          {fields.map((field, index) => (
            <SkillSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
          ))}
        </Flex>
      </Flex>
    </Section>
  )
}

const SKILL_LEVEL_NONE = '선택 안 함'
// 값=enum 코드('HIGH'|'MEDIUM'|'LOW'), 라벨=한글('상'|'중'|'하'). 온보딩·마이페이지와 동일한 매핑을 재사용해
// 폼에는 서버 enum 코드를 그대로 저장(왕복 일치)하고, 화면에만 한글 라벨을 보여준다.
// '선택 안 함'은 빈 값('')으로 저장돼 저장 시 null 처리된다.
const SKILL_LEVEL_SELECT_OPTIONS: SelectOption[] = [{ value: '', label: SKILL_LEVEL_NONE }, ...SKILL_LEVEL_OPTIONS]

const SkillLevelSelect = ({ label, placeholder, className, value, onChange }: { label: string; placeholder: string; className?: string; value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedLabel = value ? SKILL_LEVEL_LABELS[value as SkillLevel] : ''

  const handleSelect = (next: string) => {
    onChange(next)
    setIsOpen(false)
  }

  return (
    <Flex direction={'column'} gap={'2'} className={className}>
      <Text variant={'label1'} weight={'semibold'} className={'truncate'}>
        {label}
      </Text>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild={true}>
          <button
            type={'button'}
            className={cn(
              // Input과 동일한 박스 스타일을 맞춰 나란히 놓았을 때 어색하지 않게 한다.
              'text-body2 flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-4 py-3 outline-none',
              'bg-element-white border-border-subtle transition-[border-color,background-color] duration-150',
              'hover:bg-element-gray-lighter',
              'data-[state=open]:bg-element-white data-[state=open]:border-border-primary',
              value ? 'text-text-basic' : 'text-text-subtler'
            )}
          >
            <span className={'min-w-0 truncate'}>{selectedLabel || placeholder}</span>
            <ChevronDown className={'text-icon-gray size-5 shrink-0'} strokeWidth={1.67} />
          </button>
        </PopoverTrigger>
        <PopoverContent sideOffset={6} align={'start'} className={'shadow-1 w-(--radix-popover-trigger-width) overflow-hidden rounded-sm'}>
          {SKILL_LEVEL_SELECT_OPTIONS.map((option) => {
            const isSelected = value === option.value
            return (
              <button
                key={option.value || 'none'}
                type={'button'}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'bg-element-white hover:bg-element-gray-lighter shadow-1 flex items-center justify-between px-3 py-2.5 text-start',
                  isSelected ? 'text-text-basic' : 'text-text-subtle hover:text-text-basic'
                )}
              >
                <Text variant={'body2'}>{option.label}</Text>
                {isSelected && <Check className={'text-icon-gray size-4'} />}
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

const SkillSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const skill = useWatch({ control, name: `sections.${sectionIndex}.items.${index}.payload.skill` }) as { name?: string; level?: string | null } | undefined
  // 서버/폼에는 enum 코드가 담기므로 표시용 한글 라벨로 변환한다.
  const levelLabel = skill?.level ? (SKILL_LEVEL_LABELS[skill.level as SkillLevel] ?? skill.level) : ''
  const label = levelLabel ? `${skill?.name} · ${levelLabel}` : (skill?.name ?? '')

  return (
    <Chip asChild={true} variant={'tertiary'} size={'sm'} className={'max-w-50 rounded-full px-4 py-2'}>
      <Flex className={'min-w-0 gap-1.5'} align={'center'}>
        <Text variant={'body2'} className={'min-w-0 truncate'}>
          {label}
        </Text>
        <button type={'button'} onClick={onRemove} className={'shrink-0'}>
          <X size={16} />
        </button>
      </Flex>
    </Chip>
  )
}

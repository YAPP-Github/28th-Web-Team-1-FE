import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text, Button } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import { SelectBox } from '@shared/ui/select_box'
import { X } from 'lucide-react'
import { SKILL_LEVEL_LABELS, SKILL_LEVEL_OPTIONS } from '@entities/profile'
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
            <SelectBox label={'숙련도'} placeholder={'선택 안 함'} className={'w-4/10'} options={SKILL_LEVEL_OPTIONS} value={level} onChange={setLevel} />
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

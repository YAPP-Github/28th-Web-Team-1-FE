import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text, Button } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import { X } from 'lucide-react'
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
            <Input label={'기술/도구'} className={'w-3/10'} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={'숙련도'} className={'w-7/10'} value={level} onChange={(e) => setLevel(e.target.value)} />
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
  const label = skill?.level ? `${skill.name} · ${skill.level}` : (skill?.name ?? '')

  return (
    <Chip asChild={true} variant={'tertiary'} size={'sm'} className={'rounded-full px-4 py-2'}>
      <Flex className={'gap-1.5'}>
        <Text variant={'body2'}>{label}</Text>
        <button type={'button'} onClick={onRemove}>
          <X size={16} />
        </button>
      </Flex>
    </Chip>
  )
}

import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { FormInput } from '../form/FormInput'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

export const LanguageSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  return (
    <Section
      title={title}
      actionButton={
        <Button
          variant={'text'}
          size={'sm'}
          onClick={() =>
            append({ itemId: null, displayOrder: nextDisplayOrder(fields), visible: true, payload: { ...emptyItemPayload, language: { examName: '', scoreOrGrade: '', acquiredAt: null } } })
          }
        >
          어학 추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <LanguageSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const LanguageSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.language`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>어학 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'} onClick={onRemove}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.examName`} label="시험명" clearable={false} placeholder={'시험명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.scoreOrGrade`} label="점수/등급" clearable={false} placeholder={'점수 또는 등급'} className={'w-full'} />
        <FormInput name={`${base}.acquiredAt`} label="취득일" clearable={false} placeholder={'2025.11.04'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

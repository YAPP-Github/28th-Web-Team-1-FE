import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormDatePicker } from '../form/FormDatePicker'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

export const AwardSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  return (
    <Section
      title={title}
      actionButton={
        <Button
          variant={'text'}
          size={'sm'}
          onClick={() => append({ itemId: null, displayOrder: nextDisplayOrder(fields), visible: true, payload: { ...emptyItemPayload, award: { name: '', organization: null, awardedAt: null } } })}
        >
          수상 추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <AwardItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const AwardItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.award`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>수상 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="수상명" clearable={false} placeholder={'수상명을 입력해주세요.'} maxLength={48} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.organization`} label="기관" clearable={false} placeholder={'기관명을 입력해주세요.'} className={'w-full'} />
        <FormDatePicker name={`${base}.awardedAt`} label="수상일" className={'w-full'} />
      </Flex>
    </Flex>
  )
}

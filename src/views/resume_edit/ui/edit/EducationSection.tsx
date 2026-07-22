import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

export const EducationSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
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
            append({
              itemId: null,
              displayOrder: nextDisplayOrder(fields),
              visible: true,
              payload: { ...emptyItemPayload, education: { schoolName: '', major: null, degree: null, status: null, period: null } }
            })
          }
        >
          학력 추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <EducationSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const EducationSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.education`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>학력 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.schoolName`} label="학력명" clearable={false} placeholder={'학교명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.status`} label="상태" clearable={false} placeholder={'졸업예정'} className={'w-full'} />
        <FormPeriodPicker name={`${base}.period`} label="기간" className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.major`} label="전공" clearable={false} placeholder={'전공을 입력해주세요.'} className={'w-full'} />
        <FormInput name={`${base}.degree`} label="학위" clearable={false} placeholder={'학위를 입력해주세요.'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

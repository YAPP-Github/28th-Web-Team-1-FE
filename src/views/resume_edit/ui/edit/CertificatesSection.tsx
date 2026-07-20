import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { FormInput } from '../form/FormInput'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

export const CertificatesSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
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
            append({ itemId: null, displayOrder: nextDisplayOrder(fields), visible: true, payload: { ...emptyItemPayload, certificate: { name: '', organization: null, acquiredAt: null } } })
          }
        >
          자격증 추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <CertificatesSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const CertificatesSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.certificate`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>자격증 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'} onClick={onRemove}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="자격명" clearable={false} placeholder={'자격명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.organization`} label="발급기관" clearable={false} placeholder={'기관명'} className={'w-full'} />
        <FormInput name={`${base}.acquiredAt`} label="취득일" clearable={false} placeholder={'2023.01.01'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

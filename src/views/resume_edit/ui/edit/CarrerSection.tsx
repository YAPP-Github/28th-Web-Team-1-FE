import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { AiFeedbackDialog } from './AiFeedbackDialog'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
import { FormTextarea } from '../form/FormTextarea'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormValues } from '../../model/resume-form.types'

/**
 * 경력(CAREER) 편집 섹션. `useFieldArray`로 아이템 추가/삭제를 관리한다.
 * 리스트 key는 서버 itemId가 아니라 fieldArray가 주는 `field.id`를 써서 신규 항목의 중복 key를 원천 차단한다.
 */
export const CareerSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
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
            append({ itemId: null, displayOrder: nextDisplayOrder(fields), visible: true, payload: { ...emptyItemPayload, career: { companyName: '', role: null, contents: '', period: null } } })
          }
        >
          경력추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <CareerSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} targetJdId={targetJdId} />
      ))}
    </Section>
  )
}

const CareerSectionItem = ({ sectionIndex, index, onRemove, targetJdId }: { sectionIndex: number; index: number; onRemove: () => void; targetJdId: string | null }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.career`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>경력 / 활동 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.companyName`} label="회사 / 단체명 " clearable={false} placeholder={'회사명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.role`} label="직책" clearable={false} placeholder={'역할을 입력해주세요.'} className={'w-full'} />
        <FormPeriodPicker name={`${base}.period`} label="기간" className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <FormTextarea name={`${base}.contents`} label={'세부내용'} />

        <AiFeedbackDialog targets={[{ name: `${base}.contents`, label: '세부내용', kind: 'CAREER_DESCRIPTION', multiline: true }]} jdId={targetJdId} />
      </Flex>
    </Flex>
  )
}

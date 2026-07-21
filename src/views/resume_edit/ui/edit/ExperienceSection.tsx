import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { PencilSparkles, RotateCcw, Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { ExperiencePickerDialog } from '@views/resume_create'
import { Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormTextarea } from '../form/FormTextarea'
import { experiencesToFormItems } from '../../model/experiencesToFormItems'
import type { ResumeFormValues } from '../../model/resume-form.types'

/**
 * 경험(EXPERIENCE) 편집 섹션. '경험 재선택'으로 `ExperiencePickerDialog`를 열어 선택한 경험들로 아이템을 통째로 교체한다.
 * 다이얼로그는 대상 채용공고(JD) 기준 매칭 경험을 보여준다(`targetJdId`가 없으면 빈 문자열로 넘긴다).
 */
export const ExperienceSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, remove, replace } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <Section
      title={title}
      actionButton={
        <Button variant={'text'} size={'sm'} onClick={() => setIsPickerOpen(true)}>
          경험 재선택
          <RotateCcw size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {fields.map((field, index) => (
        <ExperienceSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}

      <ExperiencePickerDialog
        isOpen={isPickerOpen}
        jdId={targetJdId ?? ''}
        onOpenChange={setIsPickerOpen}
        onComplete={(experiences) => {
          replace(experiencesToFormItems(experiences))
          setIsPickerOpen(false)
        }}
      />
    </Section>
  )
}

const ExperienceSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const base = `sections.${sectionIndex}.items.${index}.payload.experience`
  // 기간(period)은 {startAt, endAt} 객체라 단일 텍스트 입력에 그대로 바인딩할 수 없어 지금은 읽기 전용으로 표시한다.
  const period = useWatch({ control, name: `sections.${sectionIndex}.items.${index}.payload.experience.period` }) as { startAt?: string | null; endAt?: string | null } | null | undefined

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>경험 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="경험명" clearable={false} placeholder={'경험명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.role`} label="역할" clearable={false} placeholder={'역할을 입력해주세요.'} className={'w-full'} />
        <Input label="기간" value={period ? `${period.startAt ?? ''}-${period.endAt ?? ''}` : ''} clearable={false} placeholder={'2025.05.09'} className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <FormTextarea name={`${base}.contents`} label={'세부내용'} />

        <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
          <PencilSparkles size={16} data-icon="inline-start" />
          AI 첨삭
        </Button>
      </Flex>
    </Flex>
  )
}

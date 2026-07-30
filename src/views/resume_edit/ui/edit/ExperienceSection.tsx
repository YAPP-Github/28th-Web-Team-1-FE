import { useEffect, useState } from 'react'
import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { usePathname, useSearchParams } from 'next/navigation'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { RotateCcw, Trash2 } from 'lucide-react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { ExperiencePickerDialog } from '@views/resume_create'
import { Section } from './Section'
import { AiFeedbackDialog } from './AiFeedbackDialog'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
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

  // Amplitude 이벤트 추적을 위해 이전에 선택된 경험 ID들을 상태로 관리한다.
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [previousExperienceIds, setPreviousExperienceIds] = useState<string[]>(() => searchParams.get('initialExperienceIds')?.split(',').filter(Boolean) ?? [])

  // 한 번 시드로 소비한 뒤엔 주소창에서 지운다. Next 라우팅(router.replace)을 타지 않고 브라우저 History API로 주소만 바꿔
  // 서버 컴포넌트 재요청/재렌더 없이 조용히 정리한다(새로고침 시 매번 first 값으로 되돌아가지 않도록).
  useEffect(() => {
    if (!searchParams.has('initialExperienceIds')) return
    window.history.replaceState(null, '', pathname)
    // 마운트 시 1회만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <ExperienceSectionItem key={field.id} sectionIndex={sectionIndex} index={index} targetJdId={targetJdId} onRemove={() => remove(index)} />
      ))}

      <ExperiencePickerDialog
        isOpen={isPickerOpen}
        jdId={targetJdId ?? ''}
        actionType={'reselect'}
        previousExperienceIds={previousExperienceIds}
        onOpenChange={setIsPickerOpen}
        onComplete={(experiences) => {
          replace(experiencesToFormItems(experiences))
          setPreviousExperienceIds(experiences.map((experience) => experience.experienceId))
          setIsPickerOpen(false)
        }}
      />
    </Section>
  )
}

const ExperienceSectionItem = ({ sectionIndex, index, targetJdId, onRemove }: { sectionIndex: number; index: number; targetJdId: string | null; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.experience`

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
        <FormPeriodPicker name={`${base}.period`} label="기간" className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <FormTextarea name={`${base}.contents`} label={'세부내용'} sectionName="experience" onCopy={() => amplitude.track(AMPLITUDE_EVENTS.TEXT_COPIED, { section_name: 'experience' })} />

        <AiFeedbackDialog
          jdId={targetJdId}
          targets={[
            { name: `${base}.name`, label: '경험명', kind: 'EXPERIENCE_TITLE', multiline: false },
            { name: `${base}.contents`, label: '세부내용', kind: 'EXPERIENCE_DESCRIPTION', multiline: true }
          ]}
        />
      </Flex>
    </Flex>
  )
}

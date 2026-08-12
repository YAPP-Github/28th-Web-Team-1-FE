import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { DatePicker } from '@shared/ui/date_picker'
import { formatDate, dateToApiDate } from '@shared/lib'
import type { ResumeFormValues } from '../../model/resume-form.types'

interface FormDatePickerProps {
  /** 날짜(단일 문자열) 필드의 폼 경로. 예: `sections.0.items.0.payload.award.awardedAt` */
  name: string
  label?: string
  className?: string
}

/**
 * 단일 날짜(연·월·일)를 `DatePicker`로 편집하는 react-hook-form 브릿지.
 *
 * 폼에는 `YYYY-MM-DD`로 저장하고, 표시/선택은 `YYYY.MM.DD`로 다룬다(점 ↔ 대시 변환은 이 브릿지가 책임진다).
 */
export const FormDatePicker = ({ name, label, className }: FormDatePickerProps) => {
  const { control } = useFormContext<ResumeFormValues>()

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => (
        <Flex direction={'column'} gap={'2'} className={className}>
          {label && (
            <Text variant={'label1'} weight={'semibold'}>
              {label}
            </Text>
          )}
          <DatePicker value={formatDate(typeof field.value === 'string' ? field.value : null, 'YYYY.MM.DD') || null} onChange={(date) => field.onChange(dateToApiDate(date))} />
        </Flex>
      )}
    />
  )
}

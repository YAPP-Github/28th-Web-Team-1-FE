import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { MonthRangePicker } from '@shared/ui/month_range_picker'
import { formatDate, monthToApiDate } from '@shared/lib'
import type { ResumeFormValues } from '../../model/resume-form.types'

type Period = { startAt: string | null; endAt: string | null } | null

interface FormPeriodPickerProps {
  /** 기간(`{ startAt, endAt }`) 객체의 폼 경로. 예: `sections.0.items.0.payload.career.period` */
  name: string
  label?: string
  className?: string
}

/**
 * 기간(시작–종료 월)을 `MonthRangePicker`로 편집하는 react-hook-form 브릿지.
 *
 * 폼에는 `{ startAt, endAt }`(각 `YYYY-MM-DD`)로 저장하고, 표시/선택은 `YYYY.MM` 단위로 다룬다.
 * 저장 포맷 변환은 `MonthRangePicker`가 아니라 이 브릿지가 책임진다(시작=1일 / 종료=말일).
 */
export const FormPeriodPicker = ({ name, label, className }: FormPeriodPickerProps) => {
  const { control } = useFormContext<ResumeFormValues>()

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => {
        const period = (field.value as Period) ?? null

        return (
          <MonthRangePicker
            label={label}
            className={className}
            start={formatDate(period?.startAt, 'YYYY.MM') || null}
            end={formatDate(period?.endAt, 'YYYY.MM') || null}
            onChangeStart={(month) => field.onChange({ startAt: monthToApiDate(month, 'start'), endAt: period?.endAt ?? null })}
            onChangeEnd={(month) => field.onChange({ startAt: period?.startAt ?? null, endAt: monthToApiDate(month, 'end') })}
          />
        )
      }}
    />
  )
}

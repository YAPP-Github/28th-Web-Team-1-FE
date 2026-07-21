import dayjs from 'dayjs'
import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { MonthPicker } from '@shared/ui/month_picker'
import { formatDate } from '@shared/lib'
import type { ResumeFormValues } from '../../model/resume-form.types'

type Period = { startAt: string | null; endAt: string | null } | null

/** 'YYYY.MM' → 저장용 'YYYY-MM-DD'. 시작은 그 달 1일, 종료는 말일(윤년 반영)로 확장한다. (`parsePeriodInput`과 동일 규약) */
const monthToApiDate = (value: string, boundary: 'start' | 'end') => {
  const first = dayjs(`${value.replace(/\./g, '-')}-01`)
  return (boundary === 'start' ? first : first.endOf('month')).format('YYYY-MM-DD')
}

interface FormPeriodPickerProps {
  /** 기간(`{ startAt, endAt }`) 객체의 폼 경로. 예: `sections.0.items.0.payload.career.period` */
  name: string
  label?: string
  className?: string
}

/**
 * 기간(시작–종료 월)을 `MonthPicker` 두 개로 편집하는 react-hook-form 브릿지.
 *
 * 폼에는 `{ startAt, endAt }`(각 `YYYY-MM-DD`)로 저장하고, 표시/선택은 `YYYY.MM` 단위로 다룬다.
 * 저장 포맷 변환은 `MonthPicker`가 아니라 이 브릿지가 책임진다(시작=1일 / 종료=말일).
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
          <Flex direction={'column'} gap={'2'} className={className}>
            {label && (
              <Text variant={'label1'} weight={'semibold'}>
                {label}
              </Text>
            )}
            <Flex align={'center'} gap={'2'}>
              <MonthPicker
                className={'min-w-0 flex-1'}
                value={formatDate(period?.startAt, 'YYYY.MM') || null}
                onChange={(month) => field.onChange({ startAt: monthToApiDate(month, 'start'), endAt: period?.endAt ?? null })}
                placeholder={'시작'}
              />
              <span className={'text-text-subtler'}>-</span>
              <MonthPicker
                className={'min-w-0 flex-1'}
                value={formatDate(period?.endAt, 'YYYY.MM') || null}
                onChange={(month) => field.onChange({ startAt: period?.startAt ?? null, endAt: monthToApiDate(month, 'end') })}
                placeholder={'종료'}
              />
            </Flex>
          </Flex>
        )
      }}
    />
  )
}

'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { MonthRangePicker } from '@shared/ui/month_range_picker'
import { formatDate, monthToApiDate } from '@shared/lib'
import type { Profile } from '@entities/profile'
import { EMPTY_CAREER, toCareerForms, withCareers, type CareerForm } from '../../model/profileForm'
import { AddItemButton, RepeatableItemHeader, SaveButton } from './sectionForm'
import { useProfileSectionForm } from '../../hooks/useProfileSectionForm'

interface CareerSectionForm {
  items: CareerForm[]
}

export const CareerSection = ({ profile }: { profile: Profile }) => {
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<CareerSectionForm>({ items: toCareerForms(profile) }, (values) => withCareers(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {fields.map((arrayField, index) => (
        <Flex key={arrayField.id} direction="column" gap="4">
          <RepeatableItemHeader title={`경력/활동 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.company`}
            render={({ field }) => (
              <Input label="회사 / 단체명" clearable={false} placeholder="회사 / 단체명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )}
          />

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.position`}
              render={({ field }) => (
                <Input label="직책" clearable={false} placeholder="직책을 입력해주세요." className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
              )}
            />
            <Controller
              control={control}
              name={`items.${index}.period`}
              render={({ field }) => {
                const period = field.value ?? { startAt: null, endAt: null }
                return (
                  <MonthRangePicker
                    label="기간"
                    className="w-full"
                    start={formatDate(period.startAt, 'YYYY.MM') || null}
                    end={formatDate(period.endAt, 'YYYY.MM') || null}
                    onChangeStart={(month) => field.onChange({ startAt: monthToApiDate(month, 'start'), endAt: period.endAt })}
                    onChangeEnd={(month) => field.onChange({ startAt: period.startAt, endAt: monthToApiDate(month, 'end') })}
                    separatorClassName="text-icon-gray-lighter"
                  />
                )
              }}
            />
          </Flex>

          <Controller
            control={control}
            name={`items.${index}.description`}
            render={({ field }) => <Textarea label="세부 내용" maxLength={500} placeholder="세부 내용을 입력해 주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
          />
        </Flex>
      ))}

      <AddItemButton label="경력 추가" onClick={() => append(EMPTY_CAREER)} />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

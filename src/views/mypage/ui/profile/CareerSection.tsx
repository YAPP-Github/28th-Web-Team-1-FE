'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { MonthPicker } from '@shared/ui/month_picker'
import { formatDate, monthToApiDate } from '@shared/lib'
import type { Profile } from '@entities/profile'
import { EMPTY_CAREER, toCareerForms, withCareers, type CareerForm } from '../../model/profileForm'
import { AddItemButton, RepeatableItemHeader, SaveButton, useProfileSectionForm } from './sectionForm'

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
          <RepeatableItemHeader title={`경력 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.company`}
            render={({ field }) => <Input label="회사명" clearable={false} placeholder="회사명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
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
                  <Flex direction="column" gap="2" className="w-full">
                    <Text variant="label1" weight="semibold">
                      기간
                    </Text>
                    <Flex align="center" gap="2">
                      <MonthPicker
                        value={formatDate(period.startAt, 'YYYY.MM') || null}
                        onChange={(month) => field.onChange({ startAt: monthToApiDate(month, 'start'), endAt: period.endAt })}
                        placeholder="시작"
                        className="min-w-0 flex-1"
                      />
                      <span className="text-text-subtler">-</span>
                      <MonthPicker
                        value={formatDate(period.endAt, 'YYYY.MM') || null}
                        onChange={(month) => field.onChange({ startAt: period.startAt, endAt: monthToApiDate(month, 'end') })}
                        placeholder="종료"
                        className="min-w-0 flex-1"
                      />
                    </Flex>
                  </Flex>
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

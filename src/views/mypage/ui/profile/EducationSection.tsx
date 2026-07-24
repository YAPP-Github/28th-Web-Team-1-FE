'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { MonthPicker } from '@shared/ui/month_picker'
import { formatDate, monthToApiDate } from '@shared/lib'
import { useProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { DEGREE_OPTIONS, EDUCATION_STATUS_OPTIONS, EMPTY_EDUCATION, toEducationForms, withEducations, type EducationForm } from '../../model/profileForm'
import { SelectBox } from './SelectBox'
import { AddItemButton, RepeatableItemHeader, SaveButton, useProfileSectionForm } from './sectionForm'

interface EducationSectionForm {
  items: EducationForm[]
}

export const EducationSection = () => {
  const profile = useProfile(useWorkspaceId())
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<EducationSectionForm>({ items: toEducationForms(profile) }, (values) => withEducations(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {fields.map((arrayField, index) => (
        <Flex key={arrayField.id} direction="column" gap="4">
          <RepeatableItemHeader title={`학력 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.school`}
            render={({ field }) => <Input label="학교명" clearable={false} placeholder="학교명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
          />

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.status`}
              render={({ field }) => <SelectBox label="상태" placeholder="졸업 예정" options={EDUCATION_STATUS_OPTIONS} className="w-full" value={field.value ?? ''} onChange={field.onChange} />}
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

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.major`}
              render={({ field }) => <Input label="전공" clearable={false} placeholder="전공명" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
            />
            <Controller
              control={control}
              name={`items.${index}.degree`}
              render={({ field }) => <SelectBox label="학위" placeholder="학사/석사/박사" options={DEGREE_OPTIONS} className="w-full" value={field.value ?? ''} onChange={field.onChange} />}
            />
          </Flex>
        </Flex>
      ))}

      <AddItemButton label="학력 추가" onClick={() => append(EMPTY_EDUCATION)} />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

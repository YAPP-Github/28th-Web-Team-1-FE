'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { DatePicker } from '@shared/ui/date_picker'
import { formatDate } from '@shared/lib'
import type { Profile } from '@entities/profile'
import { EMPTY_AWARD, toAwardForms, withAwards, type AwardForm } from '../../model/profileForm'
import { AddItemButton, RepeatableItemHeader, SaveButton, useProfileSectionForm } from './sectionForm'

interface AwardSectionForm {
  items: AwardForm[]
}

export const AwardSection = ({ profile }: { profile: Profile }) => {
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<AwardSectionForm>({ items: toAwardForms(profile) }, (values) => withAwards(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {fields.map((arrayField, index) => (
        <Flex key={arrayField.id} direction="column" gap="4">
          <RepeatableItemHeader title={`수상 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.title`}
            render={({ field }) => <Input label="수상명" clearable={false} placeholder="수상명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
          />

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.organization`}
              render={({ field }) => <Input label="기관" clearable={false} placeholder="기관명" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
            />
            <Controller
              control={control}
              name={`items.${index}.awardedAt`}
              render={({ field }) => (
                <Flex direction="column" gap="2" className="w-full">
                  <Text variant="label1" weight="semibold">
                    수상일
                  </Text>
                  <DatePicker value={formatDate(field.value || null, 'YYYY.MM.DD') || null} onChange={(date) => field.onChange(date.replace(/\./g, '-'))} />
                </Flex>
              )}
            />
          </Flex>
        </Flex>
      ))}

      <AddItemButton label="수상 추가" onClick={() => append(EMPTY_AWARD)} />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

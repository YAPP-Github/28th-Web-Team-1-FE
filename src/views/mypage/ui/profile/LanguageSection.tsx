'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { DatePicker } from '@shared/ui/date_picker'
import { formatDate } from '@shared/lib'
import type { Profile } from '@entities/profile'
import { EMPTY_LANGUAGE, toLanguageForms, withLanguageTests, type LanguageForm } from '../../model/profileForm'
import { AddItemButton, RepeatableItemHeader, SaveButton } from './sectionForm'
import { useProfileSectionForm } from '../../hooks/useProfileSectionForm'

interface LanguageSectionForm {
  items: LanguageForm[]
}

export const LanguageSection = ({ profile }: { profile: Profile }) => {
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<LanguageSectionForm>({ items: toLanguageForms(profile) }, (values) => withLanguageTests(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {fields.map((arrayField, index) => (
        <Flex key={arrayField.id} direction="column" gap="4">
          <RepeatableItemHeader title={`어학 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.testName`}
            render={({ field }) => <Input label="시험명" clearable={false} placeholder="시험명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
          />

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.score`}
              render={({ field }) => (
                <Input label="점수/등급" clearable={false} placeholder="점수 또는 등급" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
              )}
            />
            <Controller
              control={control}
              name={`items.${index}.acquiredAt`}
              render={({ field }) => (
                <Flex direction="column" gap="2" className="w-full">
                  <Text variant="label1" weight="semibold">
                    취득일
                  </Text>
                  <DatePicker value={formatDate(field.value || null, 'YYYY.MM.DD') || null} onChange={(date) => field.onChange(date.replace(/\./g, '-'))} align="end" />
                </Flex>
              )}
            />
          </Flex>
        </Flex>
      ))}

      <AddItemButton label="어학 추가" onClick={() => append(EMPTY_LANGUAGE)} />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

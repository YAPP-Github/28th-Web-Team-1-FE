'use client'
import { Controller, useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { DatePicker } from '@shared/ui/date_picker'
import { formatDate } from '@shared/lib'
import type { Profile } from '@entities/profile'
import { EMPTY_CERTIFICATE, toCertificateForms, withCertifications, type CertificateForm } from '../../model/profileForm'
import { AddItemButton, RepeatableItemHeader, SaveButton } from './sectionForm'
import { useProfileSectionForm } from '../../hooks/useProfileSectionForm'

interface CertificateSectionForm {
  items: CertificateForm[]
}

export const CertificateSection = ({ profile }: { profile: Profile }) => {
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<CertificateSectionForm>({ items: toCertificateForms(profile) }, (values) => withCertifications(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {fields.map((arrayField, index) => (
        <Flex key={arrayField.id} direction="column" gap="4">
          <RepeatableItemHeader title={`자격증 ${index + 1}`} onRemove={() => remove(index)} />

          <Controller
            control={control}
            name={`items.${index}.name`}
            render={({ field }) => <Input label="자격증명" clearable={false} placeholder="자격증명을 입력해주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
          />

          <Flex className="w-full gap-4">
            <Controller
              control={control}
              name={`items.${index}.issuer`}
              render={({ field }) => <Input label="발급기관" clearable={false} placeholder="발급기관명" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
            />
            <Controller
              control={control}
              name={`items.${index}.acquiredAt`}
              render={({ field }) => (
                <Flex direction="column" gap="2" className="w-full">
                  <Text variant="label1" weight="semibold">
                    취득일
                  </Text>
                  <DatePicker value={formatDate(field.value || null, 'YYYY.MM.DD') || null} onChange={(date) => field.onChange(date.replace(/\./g, '-'))} />
                </Flex>
              )}
            />
          </Flex>
        </Flex>
      ))}

      <AddItemButton label="자격증 추가" onClick={() => append(EMPTY_CERTIFICATE)} />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

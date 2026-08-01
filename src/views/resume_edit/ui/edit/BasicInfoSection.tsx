import { Controller, useFormContext, useWatch, type FieldPath } from 'react-hook-form'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Spacing, Text } from '@shared/ui'
import { FormInput } from '../form/FormInput'
import { Switch } from '@shared/ui/switch'
import type { ResumeFormValues } from '../../model/resume-form.types'

export const BasicInfoSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const base = `sections.${sectionIndex}.items.0.payload.basicInfo`
  // 숨기기 ON이면 연락처·이메일 입력을 비활성화한다(값은 보존).
  const shouldHideContact = Boolean(useWatch({ control, name: `${base}.hideContact` as FieldPath<ResumeFormValues> }))

  return (
    <Section title={title}>
      <Flex direction={'column'} className={'h-full'}>
        <FormInput name={`${base}.name`} label="이름" clearable={false} placeholder={'이름을 입력해주세요.'} />
        <Spacing size={16} />
        <Flex className={'w-full gap-4'}>
          <FormInput name={`${base}.phone`} label="전화번호" clearable={false} placeholder={'010-0000-0000'} className={'w-full'} disabled={shouldHideContact} />
          <FormInput name={`${base}.email`} label="이메일" clearable={false} placeholder={'이메일을 입력해주세요.'} className={'w-full'} disabled={shouldHideContact} />
        </Flex>

        <Spacing size={16} />

        <Flex justify={'end'} align={'center'} className={'gap-1.5'}>
          <Text variant={'caption1'} color={'text-subtler'}>
            연락처 및 이메일 숨기기
          </Text>
          <Controller
            control={control}
            name={`${base}.hideContact` as FieldPath<ResumeFormValues>}
            render={({ field }) => <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />}
          />
        </Flex>
      </Flex>
    </Section>
  )
}

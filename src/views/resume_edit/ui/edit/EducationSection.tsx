import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { DEGREE_OPTIONS, EDUCATION_STATUS_OPTIONS } from '@entities/profile'
import { AddItemButton, Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormSelect } from '../form/FormSelect'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
import { useSectionItems } from '../../hooks/useSectionItems'

export const EducationSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { fields, remove, addItem } = useSectionItems(sectionIndex)

  return (
    <Section title={title} actionButton={<AddItemButton label={'학력 추가'} onClick={() => addItem({ education: { schoolName: '', major: null, degree: null, status: null, period: null } })} />}>
      {fields.map((field, index) => (
        <EducationSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const EducationSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.education`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>학력 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.schoolName`} label="학력명" clearable={false} placeholder={'학교명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormSelect name={`${base}.status`} label="상태" placeholder={'선택 안 함'} options={EDUCATION_STATUS_OPTIONS} className={'w-full'} />
        <FormPeriodPicker name={`${base}.period`} label="기간" className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.major`} label="전공" clearable={false} placeholder={'전공을 입력해주세요.'} className={'w-full'} />
        <FormSelect name={`${base}.degree`} label="학위" placeholder={'선택 안 함'} options={DEGREE_OPTIONS} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

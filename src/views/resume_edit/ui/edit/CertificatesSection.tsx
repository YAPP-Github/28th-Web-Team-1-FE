import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { AddItemButton, Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormDatePicker } from '../form/FormDatePicker'
import { useSectionItems } from '../../hooks/useSectionItems'

export const CertificatesSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { fields, remove, addItem } = useSectionItems(sectionIndex)

  return (
    <Section title={title} actionButton={<AddItemButton label={'자격증 추가'} onClick={() => addItem({ certificate: { name: '', organization: null, acquiredAt: null } })} />}>
      {fields.map((field, index) => (
        <CertificatesSectionItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const CertificatesSectionItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.certificate`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>자격증 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="자격명" clearable={false} placeholder={'자격명을 입력해주세요.'} maxLength={48} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.organization`} label="발급기관" clearable={false} placeholder={'기관명'} className={'w-full'} />
        <FormDatePicker name={`${base}.acquiredAt`} label="취득일" className={'w-full'} />
      </Flex>
    </Flex>
  )
}

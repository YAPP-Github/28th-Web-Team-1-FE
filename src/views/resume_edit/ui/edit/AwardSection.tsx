import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { AddItemButton, LoadProfileButton, Section } from './Section'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormDatePicker } from '../form/FormDatePicker'
import { useSectionItems } from '../../hooks/useSectionItems'
import { useLoadProfileItems } from '../../hooks/useLoadProfileItems'
import { toAwardPayloads } from '../../model/profileToSectionPayloads'

export const AwardSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { fields, remove, addItem } = useSectionItems(sectionIndex)
  const { loadProfileItems, isLoading } = useLoadProfileItems(addItem, toAwardPayloads)

  return (
    <Section
      title={title}
      headerAction={<LoadProfileButton disabled={isLoading} onClick={loadProfileItems} />}
      footerAction={<AddItemButton label={'수상 추가'} onClick={() => addItem({ award: { name: '', organization: null, awardedAt: null } })} />}
    >
      {fields.map((field, index) => (
        <AwardItem key={field.id} sectionIndex={sectionIndex} index={index} onRemove={() => remove(index)} />
      ))}
    </Section>
  )
}

const AwardItem = ({ sectionIndex, index, onRemove }: { sectionIndex: number; index: number; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.award`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>수상 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="수상명" clearable={false} placeholder={'수상명을 입력해주세요.'} maxLength={48} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.organization`} label="기관" clearable={false} placeholder={'기관명을 입력해주세요.'} className={'w-full'} />
        <FormDatePicker name={`${base}.awardedAt`} label="수상일" className={'w-full'} />
      </Flex>
    </Flex>
  )
}

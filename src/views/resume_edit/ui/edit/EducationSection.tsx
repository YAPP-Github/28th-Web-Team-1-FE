import type { ResumeEducationFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'

export const EducationSection = ({ title, items }: { title: string; items: ResumeEducationFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <EducationSectionItem key={index} item={item} index={index} />
      ))}
    </Section>
  )
}

const EducationSectionItem = ({ item, index }: { item: ResumeEducationFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>학력 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="학력명 *" value={item.schoolName} clearable={false} placeholder={'학교명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="상태" value={item.status || ''} clearable={false} placeholder={'졸업예정'} className={'w-full'} />
        <Input label="기간" value={item.period ? `${item.period.startAt}-${item.period.endAt}` : ''} clearable={false} placeholder={'2025.05.09'} className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="전공" value={item.major || ''} clearable={false} placeholder={'전공을 입력해주세요.'} className={'w-full'} />
        <Input label="학위" value={item.degree || ''} clearable={false} placeholder={'학위를 입력해주세요.'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

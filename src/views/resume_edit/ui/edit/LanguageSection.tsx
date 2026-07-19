import type { ResumeLanguageFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'

export const LanguageSection = ({ title, items }: { title: string; items: ResumeLanguageFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <LanguageSectionItem key={index} index={index} item={item} />
      ))}
    </Section>
  )
}

const LanguageSectionItem = ({ item, index }: { item: ResumeLanguageFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>어학 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="시험명 *" value={item.examName} clearable={false} placeholder={'시험명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="점수/등급 *" value={item.scoreOrGrade || ''} clearable={false} placeholder={'점수 또는 등급'} className={'w-full'} />
        <Input label="취득일" value={item.acquiredAt || ''} clearable={false} placeholder={'2025.11.04'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

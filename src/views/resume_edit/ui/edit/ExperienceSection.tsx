import type { ResumeExperienceFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { PencilSparkles, Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'

export const ExperienceSection = ({ title, items }: { title: string; items: ResumeExperienceFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <ExperienceSectionItem key={index} item={item} index={index} />
      ))}
    </Section>
  )
}

const ExperienceSectionItem = ({ item, index }: { item: ResumeExperienceFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>경험 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="경험명 *" value={item.name} clearable={false} placeholder={'경험명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="역할" value={item.role || ''} clearable={false} placeholder={'역할을 입력해주세요.'} className={'w-full'} />
        <Input label="기간" value={item.period ? `${item.period.startAt}-${item.period.endAt}` : ''} clearable={false} placeholder={'2025.05.09'} className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <Textarea label={'세부내용 *'} value={item.contents || ''} />

        <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
          <PencilSparkles size={16} data-icon="inline-start" />
          AI 첨삭
        </Button>
      </Flex>
    </Flex>
  )
}

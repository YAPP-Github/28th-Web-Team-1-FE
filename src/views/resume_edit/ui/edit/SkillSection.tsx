import { Flex } from '@radix-ui/themes'
import type { ResumeSkillFieldsFragment } from '@shared/lib/gql/graphql'
import { Text, Button } from '@shared/ui'
import { Section } from './Section'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import { X } from 'lucide-react'

export const SkillSection = ({ title, items }: { title: string; items: ResumeSkillFieldsFragment[] }) => {
  return (
    <Section title={title}>
      <Flex className={'gap-5'} direction={'column'}>
        <Flex flexBasis={'1'} gap={'1'} align={'end'}>
          <Flex className={'w-full'} gap={'1'}>
            <Input label={'기술/도구 *'} className={'w-3/10'} />
            <Input label={'숙련도'} className={'w-7/10'} />
          </Flex>
          <Button variant={'secondary'} size={'sm'} className={'h-11.75'}>
            추가
          </Button>
        </Flex>

        <Flex gap={'1'}>
          {items.map((item, index) => (
            <SkillSectionItem key={index} item={item} />
          ))}
        </Flex>
      </Flex>
    </Section>
  )
}

const SkillSectionItem = ({ item }: { item: ResumeSkillFieldsFragment }) => {
  return (
    <Chip asChild={true} variant={'tertiary'} size={'sm'} className={'rounded-full px-4 py-2'}>
      <Flex className={'gap-1.5'}>
        <Text variant={'body2'}>{`${item.name} · ${item.level}`}</Text>
        <button>
          <X size={16} />
        </button>
      </Flex>
    </Chip>
  )
}

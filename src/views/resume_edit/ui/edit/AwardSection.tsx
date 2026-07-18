import type { ResumeAwardFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Input } from '@shared/ui/input'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const AwardSection = ({ items }: { items: ResumeAwardFieldsFragment[] }) => {
  const [awardItems, setAwardItems] = useState(items)

  return (
    <Section
      title={'수상'}
      actionButton={
        <Button
          variant={'text'}
          size={'sm'}
          onClick={() => {
            setAwardItems((prev) => [...prev, { name: '', organization: '', awardedAt: '' }])
          }}
        >
          수상추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {awardItems.map((item, index) => (
        <AwardItem key={item.name} item={item} index={index} />
      ))}
    </Section>
  )
}

const AwardItem = ({ item, index }: { item: ResumeAwardFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>수상 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="수상명" value={item.name} clearable={false} placeholder={'수상명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="기관" value={item.organization || ''} clearable={false} placeholder={'수상명을 입력해주세요.'} className={'w-full'} />
        <Input label="수상일" value={item.awardedAt || ''} clearable={false} placeholder={'2025.05.09'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

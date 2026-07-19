import type { ResumeCoreSkillFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Textarea } from '@shared/ui/textarea'
import { Button } from '@shared/ui'
import { PencilSparkles } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { useState } from 'react'

export const CoreSkillSection = ({ title, items }: { title: string; items: ResumeCoreSkillFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <CoreSkillItem key={index} item={item} index={index} />
      ))}
    </Section>
  )
}

const CoreSkillItem = ({ item, index }: { item: ResumeCoreSkillFieldsFragment; index: number }) => {
  const [value, setValue] = useState(item.content)

  return (
    <Flex direction={'column'} className={'gap-5 py-1'}>
      <Textarea key={index} label={'내용'} value={value} onChange={(e) => setValue(e.target.value)} />
      <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
        <PencilSparkles size={16} data-icon="inline-start" />
        AI 첨삭
      </Button>
    </Flex>
  )
}

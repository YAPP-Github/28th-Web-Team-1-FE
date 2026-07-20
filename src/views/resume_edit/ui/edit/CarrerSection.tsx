import type { ResumeCareerFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { PencilSparkles, Plus, Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { useState } from 'react'

export const CareerSection = ({ title, items }: { title: string; items: ResumeCareerFieldsFragment[] }) => {
  const [careerItems, setCareerItems] = useState(items)

  return (
    <Section
      title={title}
      actionButton={
        <Button
          variant={'text'}
          size={'sm'}
          onClick={() => {
            setCareerItems((prev) => [...prev, { companyName: '', role: '', period: null, contents: '' }])
          }}
        >
          경력추가
          <Plus size={16} data-icon="inline-end" />
        </Button>
      }
    >
      {careerItems.map((item, index) => (
        <CareerSectionItem key={index} item={item} index={index} />
      ))}
    </Section>
  )
}

const CareerSectionItem = ({ item, index }: { item: ResumeCareerFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>경력 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="회사명 *" value={item.companyName} clearable={false} placeholder={'회력명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="직책" value={item.role || ''} clearable={false} placeholder={'역할을 입력해주세요.'} className={'w-full'} />
        <Input label="기간" value={item.period ? `${item.period.startAt}-${item.period.endAt}` : ''} clearable={false} placeholder={'2025.05.09'} className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <Textarea label={'세부내용 *'} />

        <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
          <PencilSparkles size={16} data-icon="inline-start" />
          AI 첨삭
        </Button>
      </Flex>
    </Flex>
  )
}

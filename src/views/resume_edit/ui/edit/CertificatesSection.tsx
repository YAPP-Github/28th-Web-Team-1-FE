import type { ResumeCertificateFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { Input } from '@shared/ui/input'

export const CertificatesSection = ({ title, items }: { title: string; items: ResumeCertificateFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <CertificatesSectionItem key={index} item={item} index={index} />
      ))}
    </Section>
  )
}

const CertificatesSectionItem = ({ item, index }: { item: ResumeCertificateFieldsFragment; index: number }) => {
  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>자격증 {index + 1}</Text>

        <Button variant={'tertiary'} size={'icon-xs'}>
          <Trash2 />
        </Button>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <Input label="자격명 *" value={item.name} clearable={false} placeholder={'자격명을 입력해주세요.'} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <Input label="발급기관" value={item.organization || ''} clearable={false} placeholder={'기관명'} className={'w-full'} />
        <Input label="취득일" value={item.acquiredAt || ''} clearable={false} placeholder={'2023.01.01'} className={'w-full'} />
      </Flex>
    </Flex>
  )
}

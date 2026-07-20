import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'
import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Spacing } from '@shared/ui'
import { Input } from '@shared/ui/input'

export const BasicInfoSection = ({ title, items }: { title: string; items: ResumeBasicInfoFieldsFragment[] }) => {
  const basicInfo = items[0]

  return (
    <Section title={title}>
      <Flex direction={'column'}>
        <Input label="이름 *" value={basicInfo?.name ?? ''} clearable={false} placeholder={'이름을 입력해주세요.'} />

        <Spacing size={16} />

        <Flex className={'w-full gap-4'}>
          <Input label="이메일" value={basicInfo?.email ?? ''} clearable={false} placeholder={'이메일을 입력해주세요.'} className={'w-full'} />
          <Input label="전화번호" value={basicInfo?.phone ?? ''} clearable={false} placeholder={'010-0000-0000'} className={'w-full'} />
        </Flex>
      </Flex>
    </Section>
  )
}

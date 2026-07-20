import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Spacing } from '@shared/ui'
import { FormInput } from '../form/FormInput'

export const BasicInfoSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const base = `sections.${sectionIndex}.items.0.payload.basicInfo`

  return (
    <Section title={title}>
      <Flex direction={'column'}>
        <FormInput name={`${base}.name`} label="이름" clearable={false} placeholder={'이름을 입력해주세요.'} />
        <Spacing size={16} />
        <Flex className={'w-full gap-4'}>
          <FormInput name={`${base}.email`} label="이메일" clearable={false} placeholder={'이메일을 입력해주세요.'} className={'w-full'} />
          <FormInput name={`${base}.phone`} label="전화번호" clearable={false} placeholder={'010-0000-0000'} className={'w-full'} />
        </Flex>
        {/*Todo: 토글 스위치*/}
      </Flex>
    </Section>
  )
}

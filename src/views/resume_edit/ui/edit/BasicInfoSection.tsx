import { Section } from './Section'
import { Flex } from '@radix-ui/themes'
import { Spacing, Text } from '@shared/ui'
import { FormInput } from '../form/FormInput'
import { Switch } from '@shared/ui/switch'

export const BasicInfoSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const base = `sections.${sectionIndex}.items.0.payload.basicInfo`

  return (
    <Section title={title}>
      <Flex direction={'column'} className={'h-full'}>
        <FormInput name={`${base}.name`} label="이름" clearable={false} placeholder={'이름을 입력해주세요.'} />
        <Spacing size={16} />
        <Flex className={'w-full gap-4'}>
          <FormInput name={`${base}.email`} label="이메일" clearable={false} placeholder={'이메일을 입력해주세요.'} className={'w-full'} />
          <FormInput name={`${base}.phone`} label="전화번호" clearable={false} placeholder={'010-0000-0000'} className={'w-full'} />
        </Flex>

        <Spacing size={16} />

        <Flex justify={'end'} align={'center'} className={'gap-1.5'}>
          <Text variant={'caption1'} color={'text-subtler'}>
            연락처 및 이메일 숨기기
          </Text>
          {/*Todo: 백엔드 스키마 변경 후 연동 필요*/}
          <Switch />
        </Flex>
      </Flex>
    </Section>
  )
}

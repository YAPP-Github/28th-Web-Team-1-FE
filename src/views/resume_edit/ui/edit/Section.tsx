import { Children } from 'react'
import { Flex } from '@radix-ui/themes'
import { Divider, Spacing, Text } from '@shared/ui'

interface SectionProps {
  title: string
  actionButton?: React.ReactNode
  children: React.ReactNode
}

export const Section = ({ title, actionButton, children }: SectionProps) => {
  // 넘어온 아이템(children)이 하나도 없으면 공통 빈 상태를 대신 보여준다.
  const isEmpty = Children.count(children) === 0

  return (
    <Flex direction="column" className={'w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
        {actionButton && <Flex>{actionButton}</Flex>}
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      <Flex direction={'column'} className={'gap-12 overflow-y-auto px-1'}>
        {isEmpty ? <SectionEmpty /> : children}
      </Flex>
    </Flex>
  )
}

export const SectionEmpty = () => {
  return (
    <Text variant={'headline2'} color={'text-subtler'} className={'text-center'}>
      이력서에 입력하고 싶은 정보를 추가해주세요
    </Text>
  )
}

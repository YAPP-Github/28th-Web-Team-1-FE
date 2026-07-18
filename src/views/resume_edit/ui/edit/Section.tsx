import { Flex } from '@radix-ui/themes'
import { Divider, Spacing, Text } from '@shared/ui'

interface SectionProps {
  title: string
  actionButton?: React.ReactNode
  children: React.ReactNode
}

export const Section = ({ title, actionButton, children }: SectionProps) => {
  return (
    <Flex direction="column" className={'w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
        {actionButton && <Flex>{actionButton}</Flex>}
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      <Flex direction={'column'} className={'gap-12 overflow-y-auto px-1'}>
        {children}
      </Flex>
    </Flex>
  )
}

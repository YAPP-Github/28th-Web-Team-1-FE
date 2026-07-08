import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import Link from 'next/link'

export const ExperiencesCard = () => {
  return (
    <Link href="/experiences/1" className="w-full">
      <Flex direction="column" gap="3" className="group pointer-cursor">
        <div className="bg-element-primary-lighter group-hover:border-btn-secondary-border h-25 w-full rounded-lg transition-all group-hover:border" />
        <Flex direction="column" gap="1">
          <Text variant="caption1" color="text-subtler">
            2026.05 - 2026.07
          </Text>
          <Text variant="headline2" className="text-text-basic group-hover:text-text-primary-basic transition-colors">
            프로젝트명
          </Text>
        </Flex>
      </Flex>
    </Link>
  )
}

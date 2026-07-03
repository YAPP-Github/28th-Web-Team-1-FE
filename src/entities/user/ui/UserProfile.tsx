import { Flex } from '@radix-ui/themes'
import { Avatar } from '@shared/ui/avatar'
import { Text } from '@shared/ui/typography'
import type { UserInfo } from '../model/user.types'

export const UserProfile = ({ name, email, profileImageUrl }: UserInfo) => {
  return (
    <Flex gap={'2'}>
      <Avatar imageUrl={profileImageUrl} />
      <Flex direction="column">
        <Text variant={'label1'} color={'text-basic'}>
          {name}
        </Text>
        <Text variant={'caption1'} color={'text-subtler'}>
          {email}
        </Text>
      </Flex>
    </Flex>
  )
}

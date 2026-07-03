'use client'

import { Flex } from '@radix-ui/themes'
import { Avatar } from '@shared/ui/avatar'
import { Text } from '@shared/ui/typography'
import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueries } from '@entities/user'
import { Suspense } from 'react'
import { ErrorBoundary } from '@sentry/nextjs'

const UserProfileContent = () => {
  const { data } = useSuspenseQuery(userQueries.me())
  const { profileImageUrl, name, email } = data.me

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

export const UserProfile = () => {
  return (
    // Todo: Error fallback, Loading fallback 구현 필요
    <ErrorBoundary fallback={<div>Something went wrong while loading user profile.</div>}>
      <Suspense fallback={'...loading'}>
        <UserProfileContent />
      </Suspense>
    </ErrorBoundary>
  )
}

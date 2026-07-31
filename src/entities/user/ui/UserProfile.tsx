'use client'

import { Flex, Skeleton } from '@radix-ui/themes'
import { Avatar } from '@shared/ui/avatar'
import { Text } from '@shared/ui/typography'
import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueries } from '@entities/user'
import { Suspense } from 'react'
import { ErrorBoundary } from '@sentry/nextjs'
import { UserRoundX } from 'lucide-react'

const UserProfileContent = () => {
  const { data } = useSuspenseQuery(userQueries.me())
  const { profileImageUrl, name, email } = data.me

  return (
    <Flex gap={'2'} className={'hover:bg-element-gray-light h-11 rounded-sm p-1 hover:shadow-sm'}>
      <Avatar imageUrl={profileImageUrl} />
      <Flex direction={'column'} className={'min-w-0 flex-1'}>
        <Text variant={'label1'} color={'text-basic'} className={'truncate'}>
          {name}
        </Text>
        <Text variant={'caption1'} color={'text-subtler'} className={'truncate'}>
          {email}
        </Text>
      </Flex>
    </Flex>
  )
}

export const UserProfile = () => {
  return (
    <ErrorBoundary
      fallback={
        <Text className={'overflow-hidden text-center whitespace-pre-line'} variant={'caption2'}>
          {`사용자 정보를 불러오지 못했어요.\n잠시 후 다시 시도해 주세요.`}
        </Text>
      }
    >
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileContent />
      </Suspense>
    </ErrorBoundary>
  )
}

const UserProfileSkeleton = () => {
  return (
    <Flex gap={'2'} align={'center'} className={'p-0.5'}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-15" />
        <Skeleton className="h-3 w-25" />
      </div>
    </Flex>
  )
}

const UserAvatarContent = () => {
  const { data: profileImageUrl } = useSuspenseQuery({
    ...userQueries.me(),
    select: (data) => data.me.profileImageUrl
  })

  return (
    <Flex className={'hover:bg-element-gray-light rounded-sm p-1 hover:shadow-sm'}>
      <Avatar imageUrl={profileImageUrl} />
    </Flex>
  )
}

export const UserAvatar = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-element-disabled flex size-10 items-center justify-center rounded-full">
          <UserRoundX size={16} className="text-icon-gray-light" />
        </div>
      }
    >
      <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
        <UserAvatarContent />
      </Suspense>
    </ErrorBoundary>
  )
}

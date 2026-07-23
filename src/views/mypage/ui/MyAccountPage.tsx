'use client'

import { Suspense, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { GoogleIcon, NotionIcon } from '@shared/icon'
import { WithdrawButton } from '@features/authenticate'
import { useMe } from '@entities/user'

export const MyAccountPage = () => {
  return (
    <Flex direction="column" p="8" className="min-h-0 flex-1">
      <Heading variant="heading2">계정 관리</Heading>

      <Spacing size={32} />

      <Flex direction="column" className="w-full max-w-158.5">
        <ErrorBoundary fallback={<AccountsFallback>계정 정보를 불러오는 데 실패했습니다.</AccountsFallback>}>
          <Suspense fallback={<AccountsFallback>불러오는 중...</AccountsFallback>}>
            <ConnectedAccounts />
          </Suspense>
        </ErrorBoundary>

        <Spacing size={32} />
        <Divider color="gray-10" />
        <Spacing size={32} />

        <Flex align="center" justify="between">
          <Text variant="heading2" color="text-basic">
            계정 탈퇴
          </Text>
          <WithdrawButton />
        </Flex>
      </Flex>
    </Flex>
  )
}

const ConnectedAccounts = () => {
  const { me } = useMe()

  return (
    <Flex direction="column" gap="3">
      <AccountCard icon={<GoogleIcon size={22} />} name="Google" description={me.email} badge="기본" />
      <AccountCard icon={<NotionIcon size={22} />} name="Notion" description="연동 정보를 준비 중이에요." />
    </Flex>
  )
}

interface AccountCardProps {
  icon: ReactNode
  name: string
  description: string
  badge?: string
}
const AccountCard = ({ icon, name, description, badge }: AccountCardProps) => {
  return (
    <Flex direction="column" gap="2" className={'border-border-subtler rounded-lg border p-5'}>
      <Flex align="center" justify="between">
        <div className="bg-btn-tertiary-fill flex size-10.5 items-center justify-center rounded-lg">{icon}</div>
        {badge && <Chip size="sm">{badge}</Chip>}
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="headline2">{name}</Text>
        <Text variant="body2" color="text-basic">
          {description}
        </Text>
      </Flex>
    </Flex>
  )
}

const AccountsFallback = ({ children }: { children: ReactNode }) => (
  <Text variant="label1" color="text-subtler">
    {children}
  </Text>
)

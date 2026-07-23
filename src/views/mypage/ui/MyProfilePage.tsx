'use client'

import { Suspense } from 'react'
import { Flex } from '@radix-ui/themes'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { ErrorBoundary } from '@sentry/nextjs'
import { ChevronDown } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { Avatar } from '@shared/ui/avatar'
import { useMe } from '@entities/user'

const INFO_SECTIONS = [
  { value: 'basic', label: '기본 정보' },
  { value: 'competency', label: '핵심 역량' },
  { value: 'education', label: '학력' },
  { value: 'career', label: '경력' },
  { value: 'language', label: '어학' },
  { value: 'award', label: '수상' },
  { value: 'certificate', label: '자격증' },
  { value: 'skill', label: '기술' }
] as const

export const MyProfilePage = () => {
  return (
    <Flex direction={'column'} p={'8'} className={'min-h-0 flex-1 overflow-y-auto'}>
      <Heading variant={'heading2'}>내 정보</Heading>

      <Spacing size={32} />

      <Flex direction={'column'} className={'w-full max-w-158.5'}>
        <ErrorBoundary fallback={<ProfileSummaryFallback>사용자 정보를 불러오는 데 실패했습니다.</ProfileSummaryFallback>}>
          <Suspense fallback={<ProfileSummaryFallback>불러오는 중...</ProfileSummaryFallback>}>
            <ProfileSummary />
          </Suspense>
        </ErrorBoundary>

        <Spacing size={32} />
        <Divider color="gray-10" />
        <Spacing size={32} />

        <AccordionPrimitive.Root type={'multiple'} className={'flex flex-col gap-5'}>
          {INFO_SECTIONS.map((section) => (
            <InfoAccordionItem key={section.value} value={section.value} label={section.label} />
          ))}
        </AccordionPrimitive.Root>
      </Flex>
    </Flex>
  )
}

const ProfileSummary = () => {
  const { me } = useMe()

  return (
    <Flex gap={'5'} align={'center'} className="shadow-1 rounded-xl px-5 py-4">
      <Avatar imageUrl={me.profileImageUrl} size="xl" />
      <Flex direction={'column'}>
        <Text variant={'headline2'} color={'text-basic'}>
          {me.name}
        </Text>
        <Text variant={'label2'} color={'text-subtler'}>
          {me.email}
        </Text>
      </Flex>
    </Flex>
  )
}

const ProfileSummaryFallback = ({ children }: { children: React.ReactNode }) => (
  <Text variant={'label1'} color={'text-subtler'}>
    {children}
  </Text>
)

interface InfoAccordionItemProps {
  value: string
  label: string
}

const InfoAccordionItem = ({ value, label }: InfoAccordionItemProps) => {
  return (
    <AccordionPrimitive.Item value={value} className={'border-border-subtler overflow-hidden rounded-xl border'}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className={cn('group flex h-13.5 w-full cursor-pointer items-center justify-between py-3 pr-6 pl-5 outline-none')}>
          <Text variant="headline2" color={'text-basic'}>
            {label}
          </Text>
          <ChevronDown size={20} className={'text-icon-gray-light transition-transform duration-200 group-data-[state=open]:rotate-180'} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className={'border-border-subtler border-t px-6 py-5'}>
        <Text variant={'body2'} color={'text-subtler'}>
          아직 준비 중이에요. 곧 이곳에서 {label}을(를) 관리할 수 있어요.
        </Text>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

import { Suspense } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Heading, Spacing, Text } from '@shared/ui'
import { JDAnalysisForm } from './JDAnalysisForm'

export const HomePage = () => {
  return (
    <Flex direction={'column'} align={'center'} justify={'center'} px={'5'}>
      <Heading variant={'title2'}>지원할 공고의 링크를 입력해주세요</Heading>
      <Spacing size={12} />
      <Text as={'p'} variant={'body1'} color={'text-subtler'}>
        공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.
      </Text>

      <Spacing size={40} />

      <ErrorBoundary
        fallback={
          <Flex align="center" justify="center" className="min-h-105">
            <Text variant="body1" color="text-subtler">
              채용공고 입력창을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.
            </Text>
          </Flex>
        }
      >
        <Suspense fallback={<div className="min-h-105 w-full" />}>
          <JDAnalysisForm />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

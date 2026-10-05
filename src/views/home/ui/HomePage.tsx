import { Suspense } from 'react'
import Image from 'next/image'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { ErrorFallback, Heading, Text } from '@shared/ui'
import { JDAnalysisForm } from './JDAnalysisForm'
import { RecommendedJdSection } from './RecommendedJdSection'
import homeGradient from '../assets/home_gradient.webp'

export const HomePage = () => {
  return (
    <Flex direction={'column'} className={'min-h-0 flex-1 overflow-y-auto'}>
      <Flex direction={'column'} align={{ initial: 'start', sm: 'center' }} px={'5'} gap={{ initial: '6', sm: '40px' }} className={'relative isolate py-40'}>
        <div className="absolute inset-x-0 top-0 -z-10 h-164">
          <Image src={homeGradient} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="to-bg-white absolute inset-x-0 bottom-0 h-31 bg-linear-to-b from-transparent" />
        </div>

        <Flex direction={'column'} gap={{ initial: '1', sm: '3' }}>
          <Heading variant={'title2'}>지원할 공고의 링크를 입력해주세요</Heading>
          <Text as={'p'} variant={'body1'} color={'text-subtle'}>
            공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.
          </Text>
        </Flex>

        <ErrorBoundary fallback={<ErrorFallback title="채용공고 입력창을 불러오지 못했어요." description="새로고침 후 다시 시도해 주세요." className="min-h-56.75" />}>
          <Suspense fallback={<div className="min-h-56.75 w-full" />}>
            <JDAnalysisForm />
          </Suspense>
        </ErrorBoundary>
      </Flex>

      <Flex justify={'center'} px={'5'} pt={'3'} className={'pb-20'}>
        <ErrorBoundary fallback={<ErrorFallback title="추천 공고를 불러오지 못했어요." description="새로고침 후 다시 시도해 주세요." className="w-full max-w-215" />}>
          <Suspense fallback={<div className="min-h-130 w-full max-w-215" />}>
            <RecommendedJdSection />
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </Flex>
  )
}

import { Suspense } from 'react'
import { getImageProps } from 'next/image'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { ErrorFallback, Heading, Text } from '@shared/ui'
import { JDAnalysisForm } from './JDAnalysisForm'
import { RecommendedJdSection } from './RecommendedJdSection'
import homeGradientDesktop from '../assets/home_gradient_desktop.webp'
import homeGradientMobile from '../assets/home_gradient_mobile.webp'
import { Logo } from '@/src/shared/icon'

const {
  props: { srcSet: desktopSrcSet }
} = getImageProps({ src: homeGradientDesktop, alt: '', sizes: '100vw', priority: true })
const { props: mobileImageProps } = getImageProps({ src: homeGradientMobile, alt: '', sizes: '100vw', priority: true })

export const HomePage = () => {
  return (
    <Flex direction={'column'} className={'min-h-0 flex-1 overflow-y-auto'}>
      <Flex
        direction={'column'}
        align={{ initial: 'start', sm: 'center' }}
        px={'5'}
        pt={{ sm: '160px', initial: '20px' }}
        pb={{ sm: '160px', initial: '64px' }}
        gap={{ initial: '6', sm: '40px' }}
        className={'relative isolate'}
      >
        <Logo />
        <div className="absolute inset-x-0 -top-16.5 -z-10 sm:top-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <img {...mobileImageProps} className="h-auto w-full object-cover sm:h-164" />
          </picture>
        </div>

        <Flex direction={'column'} gap={{ initial: '1', sm: '3' }}>
          <Heading variant={{ sm: 'title2', initial: 'heading2' }}>지원할 공고의 링크를 입력해주세요</Heading>
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

      <Flex justify={'center'} px={'5'} pt={'3'} className={'relative pb-20'}>
        <ErrorBoundary fallback={<ErrorFallback title="추천 공고를 불러오지 못했어요." description="새로고침 후 다시 시도해 주세요." className="w-full max-w-215" />}>
          <Suspense fallback={<div className="min-h-130 w-full max-w-215" />}>
            <RecommendedJdSection />
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </Flex>
  )
}

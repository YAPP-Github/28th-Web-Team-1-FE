'use client'
import { Suspense, useState, useTransition } from 'react'
import Image from 'next/image'
import heroGradient from '../assets/hero_b_gradient.webp'
import { ArrowRightIcon, CalendarIcon } from 'lucide-react'
import { Flex, Grid } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { cn, formatDate } from '@shared/lib'
import { Button, ErrorFallback, Heading, Text } from '@shared/ui'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { useJdRecommendationTags, useJdRecommendations, type JdRecommendation, type JdRecommendationTag } from '@entities/jd'
import { FooterCtaSection } from './FooterCtaSection'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ProcessStepsSection } from './ProcessStepsSection'
import { TaglineSection } from './TaglineSection'
import { UploadFeatureSection } from './UploadFeatureSection'
import { AuthErrorToast, useGoogleLoginRedirect } from '@features/authenticate'

const RECOMMENDATION_SIZE = 6

/** AB-TEST(landing): 랜딩 A/B 테스트의 B안 (Aha-moment를 일찍) */
// TODO : AB-TEST(landing)
export const LandingPageB = () => {
  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 top-0 -z-10" aria-hidden>
        <div className="bg-element-primary-lighter h-[calc(--spacing(109.75)+--spacing(20))] sm:hidden" />
        <div className="relative hidden h-[calc(--spacing(164)+--spacing(26.5))] sm:block">
          <Image src={heroGradient} alt="" fill priority sizes="100vw" className="object-fill" />
        </div>
        <div className="to-bg-white absolute inset-x-0 bottom-0 h-11.25 bg-linear-to-b from-transparent" />
      </div>
      <main className="mx-auto max-w-360 px-5 pt-20 sm:px-8 sm:pt-26.5">
        <Suspense fallback={null}>
          <AuthErrorToast />
        </Suspense>
        <LandingHeader transparentAtTop />
        <JdHeroSection />
        <TaglineSection />
        <UploadFeatureSection />
        <ProcessStepsSection />
        <FooterCtaSection />
        <LandingFooter />
      </main>
    </div>
  )
}

const JdHeroSection = () => {
  const startLogin = useGoogleLoginRedirect()

  return (
    <section>
      <Flex direction={'column'} align={{ initial: 'start', sm: 'center' }} pt={{ initial: '20px', sm: '160px' }} pb={{ initial: '64px', sm: '160px' }} gap={{ initial: '6', sm: '40px' }}>
        <Flex direction={'column'} gap={{ initial: '1', sm: '3' }}>
          <Heading variant={{ initial: 'heading2', sm: 'title2' }}>지원할 공고의 링크를 입력해주세요</Heading>
          <Text as={'p'} variant={'body1'} color={'text-subtle'}>
            공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.
          </Text>
        </Flex>
        <JdInputCard onSubmit={() => startLogin()} />
      </Flex>

      <Flex justify={'center'} pt={'3'} className={'pb-4'}>
        <ErrorBoundary fallback={<ErrorFallback title="추천 공고를 불러오지 못했어요." description="새로고침 후 다시 시도해 주세요." className="w-full max-w-215" />}>
          <Suspense fallback={<div className="min-h-130 w-full max-w-215" />}>
            <RecommendedJdList onCreate={() => startLogin()} />
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </section>
  )
}

const JdInputCard = ({ onSubmit }: { onSubmit: () => void }) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url')
  const [inputValue, setInputValue] = useState('')
  const placeholder = inputType === 'url' ? 'https:// 채용 공고 링크를 입력하세요' : '채용 공고 원문을 복사해 붙여넣어 주세요. 회사명, 직무 요건, 우대사항이 포함될수록 분석 정확도가 높아져요.'

  const submit = () => {
    if (inputValue.trim()) onSubmit()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full justify-center">
      <Flex direction={'column'} gap={'4'} p={'4'} className="border-border-subtler bg-element-white shadow-3 h-fit w-full max-w-215 rounded-2xl border">
        <SelectedControl value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')} className="w-55">
          <SelectedControlItem value="url">URL 붙여넣기</SelectedControlItem>
          <SelectedControlItem value="text">원문 붙여넣기</SelectedControlItem>
        </SelectedControl>

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'field-sizing-content',
            'max-h-24 min-h-18 w-full',
            'text-body1 text-text-basic',
            'resize-none overflow-y-auto outline-none',
            'placeholder:text-body1 placeholder:text-text-subtler'
          )}
        />
        <Button variant={'primary'} size={'icon-lg'} type={'submit'} aria-label="JD 분석" disabled={!inputValue.trim()} className="ml-auto">
          <ArrowRightIcon size={20} />
        </Button>
      </Flex>
    </form>
  )
}

const RecommendedJdList = ({ onCreate }: { onCreate: () => void }) => {
  const [selectedTag, setSelectedTag] = useState<JdRecommendationTag | null>(null)
  const [, startTransition] = useTransition()
  const { tags } = useJdRecommendationTags()
  const { recommendations } = useJdRecommendations(selectedTag ? [selectedTag] : [], RECOMMENDATION_SIZE)

  return (
    <Flex direction={'column'} gap={{ initial: '4', sm: '6' }} className={'w-full max-w-215'}>
      <Text as={'p'} variant={'heading2'} color={'text-basic'}>
        아래 공고 이력서 만들어보는건 어때요?
      </Text>

      <Flex direction={'column'} gap={{ initial: '3', sm: '5' }} className={'w-full'}>
        <Flex gap={'2'} wrap={'wrap'}>
          {tags.map(({ tag, name }) => (
            <Button
              key={tag}
              size={'xs'}
              variant={selectedTag === tag ? 'secondary' : 'outline'}
              aria-pressed={selectedTag === tag}
              onClick={() => startTransition(() => setSelectedTag(selectedTag === tag ? null : tag))}
            >
              {name}
            </Button>
          ))}
        </Flex>

        {recommendations.length ? (
          <Grid columns={{ initial: '1', sm: '2' }} gap={'4'}>
            {recommendations.map((jd) => (
              <RecommendedJdCard key={jd.id} jd={jd} onCreate={onCreate} />
            ))}
          </Grid>
        ) : (
          <Text as={'p'} variant={'body2'} color={'text-subtler'}>
            추천 공고가 없어요.
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const RecommendedJdCard = ({ jd, onCreate }: { jd: JdRecommendation; onCreate: () => void }) => {
  const period = [formatDate(jd.recruitmentStartAt), formatDate(jd.recruitmentEndAt)].filter(Boolean).join(' ~ ')

  return (
    <Flex
      direction={'column'}
      justify={'between'}
      gap={'4'}
      p={{ initial: '4', sm: '5' }}
      className={cn(
        'min-w-0 rounded-lg',
        // sm
        'sm:border-border-subtler sm:bg-element-white sm:shadow-2 sm:border',
        // initial
        'bg-element-gray-lighter'
      )}
    >
      <Flex direction={'column'} className="gap-1.5">
        <Text as={'p'} variant={'label1'} color={'text-basic'} className={'truncate'}>
          [{jd.companyName}] {jd.title}
        </Text>
        {period && (
          <Flex align={'center'} gap={'1'}>
            <CalendarIcon size={12} className={'text-text-subtler'} />
            <Text variant={'caption2'} color={'text-subtler'}>
              {period}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex gap={'2'}>
        <Button asChild size={'xs'} variant={'secondary'}>
          <a href={jd.sourceUrl} target={'_blank'} rel={'noopener noreferrer'}>
            공고 보기
          </a>
        </Button>
        <Button size={'xs'} variant={'secondary'} onClick={onCreate}>
          이력서 만들기
        </Button>
      </Flex>
    </Flex>
  )
}

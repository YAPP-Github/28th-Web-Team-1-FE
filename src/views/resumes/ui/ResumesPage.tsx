'use client'

import { Suspense, useRef, type ComponentProps, type ReactNode } from 'react'
import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Button, Divider, ErrorFallback, Heading, Spacing, Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { formatDate } from '@shared/lib'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import type { ResumeStatusType, ResumesQuery } from '@shared/lib/gql/graphql'
import { useResumeCounts, useResumeList } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { ArrowRightIcon } from 'lucide-react'

type ResumeSummary = ResumesQuery['resumes']['resumes'][number]

/** 이력서 상태별 CTA 버튼(라벨·스타일·이동 경로). 카드가 resume.status로 골라 쓴다. */
const RESUME_CTA: Record<ResumeStatusType, { label: string; variant: ComponentProps<typeof Button>['variant']; href: (resumeId: string) => string }> = {
  DRAFT: { label: '이어서 작성', variant: 'primary', href: (resumeId) => `/resumes/edit/${resumeId}` },
  COMPLETED: { label: '이력서 확인', variant: 'secondary', href: (resumeId) => `/resumes/${resumeId}` }
}

export const ResumesPage = () => {
  return (
    <Flex direction={'column'} p={'8'} className={'min-h-0 flex-1'}>
      <Flex direction={'column'} gap={'2'}>
        <Heading variant={'heading2'}>이력서</Heading>
        <Text as={'p'} variant={'body1'} color={'text-subtler'}>
          분석한 공고에 맞춰 작성한 이력서를 모아볼 수 있어요.
        </Text>
      </Flex>

      <Spacing size={32} />

      <ErrorBoundary fallback={<ErrorFallback title="이력서 정보를 불러오지 못했어요." description="잠시 후 다시 시도해주세요." className="flex-1" />}>
        <Suspense fallback={<ResumesFallback>불러오는 중...</ResumesFallback>}>
          <ResumeSections />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

const ResumeSections = () => {
  const workspaceId = useWorkspaceId()
  const { counts } = useResumeCounts(workspaceId)

  return (
    <>
      <ResumeSection title={'진행중'} status={'DRAFT'} total={counts.DRAFT ?? 0} workspaceId={workspaceId} />
      <Spacing size={40} />
      <ResumeSection title={'완료'} status={'COMPLETED'} total={counts.COMPLETED ?? 0} workspaceId={workspaceId} />
    </>
  )
}

interface ResumeSectionProps {
  title: string
  status: ResumeStatusType
  total: number
  workspaceId: string
}

const ResumeSection = ({ title, status, total, workspaceId }: ResumeSectionProps) => {
  const { resumes, hasNextPage, fetchNextPage, isFetchingNextPage } = useResumeList(workspaceId, status)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    root: scrollRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage
  })

  return (
    <section className={'flex min-h-0 flex-1 flex-col gap-4'}>
      <Flex gap={'2'} align={'center'}>
        <Text variant={'headline1'}>{title}</Text>
        <Text variant={'label1'} color={'text-subtler'} className={'tabular-nums'}>
          {total}
        </Text>
      </Flex>

      <Flex ref={scrollRef} direction={'column'} className={'min-h-0 flex-1 gap-4 overflow-y-auto'}>
        {resumes.length === 0 ? <EmptyResumes type={status} /> : resumes.map((resume) => <ResumeCard key={resume.resumeId} resume={resume} />)}
        {hasNextPage && <div ref={sentinelRef} aria-hidden className={'h-px shrink-0'} />}
      </Flex>
    </section>
  )
}

const ResumeCard = ({ resume }: { resume: ResumeSummary }) => {
  const { targetJd, createdAt, status } = resume
  const competencies = targetJd?.coreCompetencies ?? []
  const cta = RESUME_CTA[status]

  return (
    <Flex align={'center'} className={'border-b-border-subtle rounded-2xl border px-6 py-5'}>
      <Flex direction={'column'} className={'flex-1'}>
        <Flex align={'center'} gap={'2'}>
          <Text variant={'headline2'}>{targetJd?.companyName || '기업명'}</Text>
          <Divider orientation={'vertical'} size={2} className={'h-3'} />
          <Text variant={'headline2'}>{targetJd?.positionTitle || '포지션'}</Text>
        </Flex>

        <Spacing size={16} />

        <Flex gap={'4'}>
          <Text variant={'label2'} color={'text-subtler'} className={'w-13'}>
            등록일
          </Text>
          <Text variant={'label2'} color={'text-bolder'}>
            {formatDate(createdAt)}
          </Text>
        </Flex>

        <Spacing size={8} />

        <Flex gap={'4'}>
          <Text variant={'label2'} color={'text-subtler'} className={'w-13'}>
            관련 역량
          </Text>
          <Flex gap={'1'}>
            {competencies.map((competency) => (
              <Chip key={competency} size={'sm'}>
                {competency}
              </Chip>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Button asChild variant={cta.variant} size={'md'}>
        <Link href={cta.href(resume.resumeId)}>
          <span className={'leading-none'}>{cta.label}</span>
          <ArrowRightIcon size={18} data-icon="inline-end" />
        </Link>
      </Button>
    </Flex>
  )
}

const ResumesFallback = ({ children }: { children: ReactNode }) => (
  <Flex align={'center'} justify={'center'} className={'flex-1'}>
    <Text variant={'label1'} color={'text-subtle'}>
      {children}
    </Text>
  </Flex>
)

const EmptyResumes = ({ type }: { type: ResumeSummary['status'] }) => {
  const fallbackText = {
    COMPLETED: {
      title: '아직 완성한 이력서가 없어요',
      description: '진행 중인 공고에서 이력서 생성을 끝내면 여기로 옮겨져요.'
    },
    DRAFT: {
      title: '작성 중인 이력서가 없어요',
      description: '지원하고 싶은 공고를 분석하고 이력서를 작성할 수 있어요.'
    }
  }

  return (
    <Flex direction={'column'} gap={'3'} className={'py-9 text-center'}>
      <Text variant={'headline2'}>{fallbackText[type].title}</Text>
      <Text variant={'body2'} color={'text-subtler'}>
        {fallbackText[type].description}
      </Text>
    </Flex>
  )
}

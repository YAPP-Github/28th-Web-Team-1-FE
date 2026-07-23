'use client'
import { Suspense, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment, ResumeQuery } from '@shared/lib/gql/graphql'
import { useResumeDetail } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { ResumeBasicInfoHeader, ResumeSectionView, toPreviewSections, type ResumeSectionData } from '@widgets/resume_preview'
import { Download, Pencil } from 'lucide-react'
import Link from 'next/link'

export const ResumeDetailPage = ({ resumeId }: { resumeId: string }) => {
  return (
    <Flex direction="column" className="h-full flex-1 overflow-hidden">
      <ErrorBoundary fallback={<ResumeFallback>이력서를 불러오는 데 실패했습니다.</ResumeFallback>}>
        <Suspense fallback={<ResumeFallback>불러오는 중...</ResumeFallback>}>
          <ResumeDetail resumeId={resumeId} />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

// Todo: 로딩 스피너 교체
const ResumeFallback = ({ children }: { children: ReactNode }) => (
  <Flex align="center" justify="center" className="flex-1">
    <Text variant={'label1'} color={'text-subtle'}>
      {children}
    </Text>
  </Flex>
)

/**
 * 이력서 상세는 편집과 달리 폼 없이 서버 응답을 그대로 읽기 전용으로 보여준다.
 * 미리보기 조각(헤더·섹션)은 편집 화면과 동일한 `@widgets/resume_preview`를 공유한다.
 */
const ResumeDetail = ({ resumeId }: { resumeId: string }) => {
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)

  const { basicInfoSection, bodySections } = toPreviewSections(resume.sections)
  const basicInfo = basicInfoSection?.items[0]?.payload.basicInfo ?? null

  return (
    <Flex direction="column" className="h-full flex-1 overflow-hidden">
      <ResumeToolbar resumeId={resumeId} targetJd={resume.targetJd} />
      <main className="flex min-h-0 flex-1">
        <ResumePreview basicInfo={basicInfo} sections={bodySections} />
        <JDInfo />
      </main>
    </Flex>
  )
}

interface ResumeToolbarProps {
  resumeId: string
  targetJd: ResumeQuery['resume']['targetJd']
}

/** 편집 화면 상단 도구바. 이력서가 맞춤 대상으로 삼은 채용공고(targetJd)의 회사명·포지션과 저장 상태·액션을 보여준다. */
const ResumeToolbar = ({ resumeId, targetJd }: ResumeToolbarProps) => {
  return (
    <header className={'flex justify-between px-8 py-5'}>
      <Flex direction="column" justify="center" className={'gap-0.5'}>
        <Text variant="heading2">{targetJd?.companyName ?? '이력서'}</Text>
        <Text variant="body2" color="text-subtle">
          {targetJd?.positionTitle ?? '포지션'}
        </Text>
      </Flex>

      <Flex align={'center'} gap="4">
        <Button asChild variant="secondary" size={'md'} className={'leading-0'}>
          <Link href={`/home/resume/${resumeId}`}>
            <Pencil size={18} className="inline-block" data-icon="inline-start" />
            수정
          </Link>
        </Button>

        <Button variant="primary" size={'md'} className={'leading-0'}>
          <Download size={18} className="inline-block" data-icon="inline-start" />
          다운로드
        </Button>
      </Flex>
    </header>
  )
}

const ResumePreview = ({ basicInfo, sections }: { basicInfo: ResumeBasicInfoFieldsFragment | null; sections: ResumeSectionData[] }) => {
  return (
    <Flex align={'center'} className={'bg-bg-gray-subtler flex-1'}>
      <Flex direction={'column'} className={'bg-bg-white mx-auto h-[calc(100%-2rem)] w-149 min-w-149 overflow-y-auto p-7'}>
        <ResumeBasicInfoHeader basicInfo={basicInfo} />

        <Spacing size={12} />
        <Divider color={'gray-10'} />
        <Spacing size={12} />

        <Flex direction={'column'} gap="5">
          {sections.map((section) => (
            <ResumeSectionView key={section.sectionId} section={section} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const JDInfo = () => {
  return <Flex align={'center'} className={' '}></Flex>
}

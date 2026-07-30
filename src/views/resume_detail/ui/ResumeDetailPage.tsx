'use client'
import { Suspense, useState, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Button, Spacing, Text } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment, ResumeQuery } from '@shared/lib/gql/graphql'
import { useResumeDetail, toPreviewSections, type ResumeSectionData } from '@entities/resume'
import { useJdDetail, useJdInsight } from '@entities/jd'
import { useWorkspaceId } from '@entities/user'
import { Pencil } from 'lucide-react'
import { ResumeDownloadButton, ResumePdfPreview } from '@features/resume_pdf_download'
import Link from 'next/link'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'

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
      <ResumeToolbar resumeId={resumeId} targetJd={resume.targetJd} basicInfo={basicInfo} sections={bodySections} />
      <main className="flex min-h-0 flex-1">
        <ResumePdfPreview basicInfo={basicInfo} sections={bodySections} />
        <JDInfo workspaceId={workspaceId} jdId={resume.targetJd?.jdId ?? null} />
      </main>
    </Flex>
  )
}

interface ResumeToolbarProps {
  resumeId: string
  targetJd: ResumeQuery['resume']['targetJd']
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
}

/** 편집 화면 상단 도구바. 이력서가 맞춤 대상으로 삼은 채용공고(targetJd)의 회사명·포지션과 저장 상태·액션을 보여준다. */
const ResumeToolbar = ({ resumeId, targetJd, basicInfo, sections }: ResumeToolbarProps) => {
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
          <Link href={`/resumes/edit/${resumeId}`}>
            <Pencil size={18} className="inline-block" data-icon="inline-start" />
            수정
          </Link>
        </Button>

        <ResumeDownloadButton basicInfo={basicInfo} sections={sections} />
      </Flex>
    </header>
  )
}

const JD_SOURCE_TAB = 'jd-source'
const JD_INSIGHT_TAB = 'ai-insight'

/**
 * 이력서가 맞춤 대상으로 삼은 채용공고(targetJd) 정보 패널.
 * '공고 원문' 탭은 JD 단건 조회(`useJdDetail`)로 팀 소개·업무내용·자격요건·우대경험·전형 절차를 보여준다.
 * JD 조회의 로딩·에러는 탭 콘텐츠 내부의 `Suspense`/`ErrorBoundary`가 처리한다.
 */
const JDInfo = ({ workspaceId, jdId }: { workspaceId: string; jdId: string | null }) => {
  const [tab, setTab] = useState(JD_SOURCE_TAB)

  return (
    <Flex direction={'column'} className={'bg-bg-white mx-auto w-160 min-w-160 px-8 py-6'}>
      <SelectedControl value={tab} onValueChange={setTab} className={'w-50'}>
        <SelectedControlItem value={JD_SOURCE_TAB}>공고 원문</SelectedControlItem>
        <SelectedControlItem value={JD_INSIGHT_TAB}>AI 인사이트</SelectedControlItem>
      </SelectedControl>

      <Spacing size={24} />

      <Flex direction={'column'} className={'min-h-0 flex-1 overflow-y-auto'}>
        {jdId === null ? (
          <JDPlaceholder>연결된 채용공고가 없어요.</JDPlaceholder>
        ) : (
          <ErrorBoundary fallback={<JDPlaceholder>채용공고 정보를 불러오지 못했어요.</JDPlaceholder>}>
            <Suspense fallback={<JDPlaceholder>불러오는 중...</JDPlaceholder>}>
              {tab === JD_SOURCE_TAB ? <JDSource workspaceId={workspaceId} jdId={jdId} /> : <JDInsight workspaceId={workspaceId} jdId={jdId} />}
            </Suspense>
          </ErrorBoundary>
        )}
      </Flex>
    </Flex>
  )
}

const JDPlaceholder = ({ children }: { children: ReactNode }) => (
  <Flex align={'center'} justify={'center'} className={'flex-1 py-20'}>
    <Text variant={'body2'} color={'text-subtler'}>
      {children}
    </Text>
  </Flex>
)

/** '공고 원문' 탭 본문. JD 단건 조회 결과를 5개 섹션으로 렌더한다. */
const JDSource = ({ workspaceId, jdId }: { workspaceId: string; jdId: string }) => {
  const { jd } = useJdDetail(workspaceId, jdId)
  if (!jd) return <JDPlaceholder>공고 원문 정보가 없어요.</JDPlaceholder>

  return (
    <Flex direction={'column'} gap={'7'}>
      <JDParagraphSection title={'팀 소개'} content={jd.companyIntro} />
      <JDListSection title={'업무내용'} items={jd.responsibilities} />
      <JDListSection title={'자격요건'} items={jd.requiredExperiences} />
      <JDListSection title={'우대경험'} items={jd.preferredExperiences} />
      <JDListSection title={'전형 절차'} items={jd.hiringProcess} />
    </Flex>
  )
}

/** 'AI 인사이트' 탭 본문. 등록 시 AI가 생성해 저장한 지원 전략을 보여준다. */
const JDInsight = ({ workspaceId, jdId }: { workspaceId: string; jdId: string }) => {
  const { insight } = useJdInsight(workspaceId, jdId)
  if (!insight) return <JDPlaceholder>AI 인사이트 정보가 없어요.</JDPlaceholder>

  return (
    <Flex direction={'column'} gap={'7'}>
      <JDParagraphSection title={'지원 전략'} content={insight.strategy} />
    </Flex>
  )
}

const JDSectionTitle = ({ children }: { children: ReactNode }) => (
  <Text variant={'headline2'} weight={'semibold'} color={'text-primary-basic'}>
    {children}
  </Text>
)

const JDEmptyField = () => (
  <Text variant={'body2'} color={'text-subtler'}>
    등록된 정보가 없어요.
  </Text>
)

const JDParagraphSection = ({ title, content }: { title: string; content: string }) => (
  <Flex direction={'column'} gap={'3'}>
    <JDSectionTitle>{title}</JDSectionTitle>
    {content.trim().length === 0 ? (
      <JDEmptyField />
    ) : (
      <Text variant={'label2'} color={'text-subtle'} className={'whitespace-pre-wrap'}>
        {content}
      </Text>
    )}
  </Flex>
)

const JDListSection = ({ title, items }: { title: string; items: string[] }) => (
  <Flex direction={'column'} gap={'3'}>
    <JDSectionTitle>{title}</JDSectionTitle>
    {items.length === 0 ? (
      <JDEmptyField />
    ) : (
      <Flex asChild direction={'column'} gap={'2'}>
        <ul>
          {items.map((item, index) => (
            <Flex asChild key={index} gap={'2'} align={'start'}>
              <li>
                <span className={'bg-border-subtle mt-2 size-1 shrink-0 rounded-full'} />
                <Text variant={'label2'} color={'text-subtle'} className={'whitespace-pre-wrap'}>
                  {item}
                </Text>
              </li>
            </Flex>
          ))}
        </ul>
      </Flex>
    )}
  </Flex>
)

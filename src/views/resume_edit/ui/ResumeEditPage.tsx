'use client'
import { Suspense, useState, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { FileCheckCorner, RefreshCcw } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment, ResumeQuery } from '@shared/lib/gql/graphql'
import { useResumeDetail } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { ResumeIndex } from './ResumeIndex'
import { ResumeSectionView, type ResumeSectionData } from './ResumeSectionView'

export const ResumeEditPage = ({ resumeId }: { resumeId: string }) => {
  return (
    <Flex direction="column" className="h-full flex-1 overflow-hidden">
      <ErrorBoundary fallback={<ResumeFallback>이력서를 불러오는 데 실패했습니다.</ResumeFallback>}>
        <Suspense fallback={<ResumeFallback>불러오는 중...</ResumeFallback>}>
          <ResumeWorkspace resumeId={resumeId} />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

const ResumeFallback = ({ children }: { children: ReactNode }) => (
  <Flex align="center" justify="center" className="flex-1">
    <Text variant={'label1'} color={'text-subtle'}>
      {children}
    </Text>
  </Flex>
)

/**
 * 이력서 상세를 한 번 조회해 헤더·미리보기·목차·편집 영역이 같은 데이터를 공유하게 한다.
 * `BASIC_INFO`는 미리보기 헤더 전용이라 본문 섹션(`bodySections`)에서 분리한다.
 */
const ResumeWorkspace = ({ resumeId }: { resumeId: string }) => {
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  const sections = [...resume.sections].filter((section) => section.visible).sort((a, b) => a.displayOrder - b.displayOrder)
  const basicInfo = resume.sections.find((section) => section.type === 'BASIC_INFO')?.items[0]?.payload.basicInfo ?? null
  const bodySections = sections.filter((section) => section.type !== 'BASIC_INFO')

  return (
    <>
      <ResumeToolbar targetJd={resume.targetJd} />
      <main className="bg-bg-gray-subtler flex min-h-0 flex-1">
        <ResumePreview basicInfo={basicInfo} sections={bodySections} activeSectionId={activeSectionId} onSelectSection={setActiveSectionId} />
        <ResumeIndex sections={bodySections} activeSectionId={activeSectionId} />
        <ResumeEdit />
      </main>
    </>
  )
}

/** 편집 화면 상단 도구바. 이력서가 맞춤 대상으로 삼은 채용공고(targetJd)의 회사명·포지션과 저장 액션을 보여준다. */
const ResumeToolbar = ({ targetJd }: { targetJd: ResumeQuery['resume']['targetJd'] }) => {
  return (
    <header className={'flex justify-between px-8 py-5'}>
      <Flex direction="column" justify="center" className={'gap-0.5'}>
        <Text variant="heading2">{targetJd?.companyName ?? '이력서'}</Text>
        {targetJd?.positionTitle && (
          <Text variant="body2" color="text-subtle">
            {targetJd.positionTitle}
          </Text>
        )}
      </Flex>

      <Flex align={'center'} gap="4">
        <Text variant="label2" color="text-subtler">
          <RefreshCcw className="mr-2.5 inline-block" size={16} />
          19:53:30 자동 저장되었습니다.
        </Text>

        <Button variant="primary" size={'md'} className={'leading-0'}>
          <FileCheckCorner size={18} className="inline-block" />
          이력서 저장
        </Button>
      </Flex>
    </header>
  )
}

const ResumePreview = ({
  basicInfo,
  sections,
  activeSectionId,
  onSelectSection
}: {
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
  activeSectionId: string | null
  onSelectSection: (sectionId: string) => void
}) => {
  return (
    <Flex direction={'column'} className={'bg-bg-white m-4 h-[calc(100%-2rem)] w-149 min-w-149 overflow-y-auto p-7'}>
      <ResumeBasicInfoHeader basicInfo={basicInfo} />

      <Spacing size={12} />
      <Divider color={'gray-10'} />
      <Spacing size={12} />

      <Flex direction={'column'} gap="5">
        {sections.map((section) => (
          <div
            key={section.sectionId}
            role="button"
            tabIndex={0}
            data-active={activeSectionId === section.sectionId}
            onClick={() => onSelectSection(section.sectionId)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectSection(section.sectionId)
              }
            }}
            className={'group cursor-pointer rounded-sm outline-none'}
          >
            <ResumeSectionView section={section} />
          </div>
        ))}
      </Flex>
    </Flex>
  )
}

const ResumeBasicInfoHeader = ({ basicInfo }: { basicInfo: ResumeBasicInfoFieldsFragment | null }) => {
  return (
    <section className={'flex w-full justify-between'}>
      <Text variant={'title1'}>{basicInfo?.name}</Text>

      <Flex direction="column" gap="2">
        {basicInfo?.phone && (
          <Text size={'1'} color={'gray-40'}>
            {basicInfo.phone}
          </Text>
        )}
        {basicInfo?.email && (
          <Text size={'1'} color={'gray-40'}>
            {basicInfo.email}
          </Text>
        )}
      </Flex>
    </section>
  )
}

const ResumeEdit = () => {
  return <Flex className={'bg-bg-white w-full'}>이력서 편집</Flex>
}

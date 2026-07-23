'use client'
import { Suspense, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { Divider, Spacing, Text } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'
import { useResumeDetail } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { ResumeBasicInfoHeader, ResumeSectionView, toPreviewSections, type ResumeSectionData } from '@widgets/resume_preview'

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
    <main className="flex min-h-0 flex-1">
      <ResumePreview basicInfo={basicInfo} sections={bodySections} />
      <JDInfo />
    </main>
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

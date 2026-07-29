'use client'
import { useIsMutating } from '@tanstack/react-query'
import { Flex, Skeleton } from '@radix-ui/themes'
import { profileKeys } from '@entities/profile'
import { ResumeSectionView, Section } from '@widgets/resume_preview'
import { type ResumeSectionData } from '@entities/resume'

/**
 * 편집 페이지 미리보기 전용 핵심역량 섹션.
 * 페이지 진입 시 도는 핵심역량 자동 생성(ResumeWorkspace)이 진행 중이면 스켈레톤을 보여주고,
 * 그 외에는 공용 미리보기 렌더(`ResumeSectionView`)에 그대로 위임한다.
 * 생성-로딩 로직은 이 컴포넌트가 소유해 공용 위젯은 순수하게 유지한다.
 */
export const CoreSkillPreviewSection = ({ section }: { section: ResumeSectionData }) => {
  const isGenerating = useIsMutating({ mutationKey: profileKeys.generateCoreCompetency() }) > 0

  if (!isGenerating) return <ResumeSectionView section={section} />

  return (
    <Section title={section.displayText}>
      <Flex direction={'column'} className={'gap-1'}>
        {[100, 100, 100, 100, 60].map((width, index) => (
          <Skeleton key={index} height={'10px'} width={`${width}%`} />
        ))}
      </Flex>
    </Section>
  )
}

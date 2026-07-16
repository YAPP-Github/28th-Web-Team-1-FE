'use client'
import { Flex } from '@radix-ui/themes'
import { useProject } from '@entities/project'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'
import { getProjectMeta } from '../lib/projectMeta'
import { AddExperienceDialog } from './AddExperienceDialog'
import type { ProjectMeta } from '../lib/projectMeta'
import { Chip } from '@shared/ui/chip'

interface ExperienceListItem {
  experienceId: string
  title: string
  tags: string[]
}

interface ExperienceListSectionProps {
  workspaceId: string
  projectId: string
  experiences: ExperienceListItem[]
  expanded: boolean
  selectedId: string | null
  onSelect: (experienceId: string) => void
}

/** 경험 상세 페이지의 "경험 목록" 섹션 (헤더 + 추가 버튼 + 카드 그리드 / 빈 상태) */
export const ExperienceListSection = ({ workspaceId, projectId, experiences, expanded, selectedId, onSelect }: ExperienceListSectionProps) => {
  // 카드/모달에 표시할 역할·기간은 프로젝트 값(경험 단위 값 없음). 페이지가 이미 받아둔 프로젝트 캐시를 dedupe로 읽는다.
  const { project } = useProject(workspaceId, projectId)
  const projectMeta = getProjectMeta(project)

  return (
    <Flex direction="column" className="gap-3">
      <Flex align="center" justify="between">
        <Text variant="headline1" color="text-basic">
          경험 목록
        </Text>
        <AddExperienceDialog workspaceId={workspaceId} projectId={projectId} />
      </Flex>
      {experiences.length === 0 ? (
        <Flex direction="column" align="center" justify="center" className="border-border-subtle h-32 rounded-lg border border-dashed px-6 py-5" gap="3">
          <Text variant="headline2" color="text-basic">
            아직 작성된 경험이 없어요.
          </Text>
          <Text variant="body2" color="text-subtler">
            경험을 추가하면 AI가 STAR 구조로 정리해 이력서 소재로 활용할 수 있어요.
          </Text>
        </Flex>
      ) : (
        <div className={cn('grid w-full gap-4', expanded ? 'grid-cols-1' : 'grid-cols-2')}>
          {experiences.map((experience) => (
            <ExperienceListCard
              key={experience.experienceId}
              title={experience.title}
              keywords={experience.tags}
              projectMeta={projectMeta}
              selected={selectedId === experience.experienceId}
              onSelect={() => onSelect(experience.experienceId)}
            />
          ))}
        </div>
      )}
    </Flex>
  )
}

interface ExperienceListCardProps {
  title: string
  keywords: string[]
  projectMeta: ProjectMeta
  selected?: boolean
  onSelect?: () => void
}

export const ExperienceListCard = ({ title, keywords, projectMeta, selected = false, onSelect }: ExperienceListCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect?.()}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex cursor-pointer flex-col gap-3 rounded-lg p-4 text-left ring transition-colors ring-inset',
        selected ? 'bg-element-primary-lighter ring-border-primary shadow-1' : 'bg-element-white ring-border-subtler shadow-1 hover:bg-element-gray-lighter hover:shadow-none hover:ring-transparent'
      )}
    >
      <Text variant="headline2" color="text-basic">
        {title}
      </Text>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="4">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            역할 및 기간
          </Text>
          <Flex align="center" gap="6px">
            <Text variant="label2" color="text-bolder">
              {projectMeta.role || '-'}
            </Text>
            <span className="bg-border-subtle h-3 w-px shrink-0 rounded-full" />
            <Text variant="label2" color="text-bolder">
              {projectMeta.period || '-'}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap="5">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            관련 역량
          </Text>
          <Flex align="center" gap="1" className="min-w-0 flex-1 flex-wrap">
            {keywords.map((keyword, index) => (
              <Chip key={index} size="sm" className={cn('group-hover:bg-element-white', selected && 'bg-element-white')}>
                {keyword}
              </Chip>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import type { ProjectMeta } from '../lib/projectMeta'
import { ExperienceListCard } from './ExperienceListCard'
import { ExperienceFormDialog } from './ExperienceFormDialog'

interface ExperienceListItem {
  experienceId: string
  title: string
  tags: string[]
}

interface ExperienceListSectionProps {
  workspaceId: string
  projectId: string
  experiences: ExperienceListItem[]
  /** 카드에 표시할 역할·기간 (경험 단위 값이 없어 프로젝트 값을 공통 표시) */
  projectMeta: ProjectMeta
  /** 상세 패널이 열려 목록이 1열로 좁아진 상태인지 */
  expanded: boolean
  selectedId: string | null
  onSelect: (experienceId: string) => void
}

/** 경험 상세 페이지의 "경험 목록" 섹션 (헤더 + 추가 버튼 + 카드 그리드 / 빈 상태) */
export const ExperienceListSection = ({ workspaceId, projectId, experiences, projectMeta, expanded, selectedId, onSelect }: ExperienceListSectionProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <Flex direction="column" className="gap-3">
      <Flex align="center" justify="between">
        <Text variant="headline1" color="text-basic">
          경험 목록
        </Text>
        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} data-icon="inline-start" />
          경험 추가하기
        </Button>
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

      {isAddOpen && <ExperienceFormDialog mode="create" onClose={() => setIsAddOpen(false)} workspaceId={workspaceId} projectId={projectId} projectMeta={projectMeta} />}
    </Flex>
  )
}

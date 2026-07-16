'use client'
import { Suspense, useState } from 'react'
import { useParams } from 'next/navigation'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { useProject } from '@entities/project'
import { useProjectExperiences } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'
import { getProjectMeta } from '../lib/projectMeta'
import { ProjectInfoCard } from './ProjectInfoCard'
import { ExperienceListSection } from './ExperienceListSection'
import { ExperienceDetailPanel } from './ExperienceDetailPanel'

export const ExperienceDetailPage = () => {
  const { id: projectId } = useParams<{ id: string }>()

  return (
    <ErrorBoundary
      fallback={
        <Flex align="center" justify="center" className="h-screen">
          <Text variant="body1" color="text-subtler">
            프로젝트를 불러오는데 실패했습니다.
          </Text>
        </Flex>
      }
    >
      <Suspense
        fallback={
          <Flex align="center" justify="center" className="h-screen">
            <Text variant="headline2" color="text-basic">
              로딩중
            </Text>
          </Flex>
        }
      >
        <ExperienceDetailContent projectId={projectId} />
      </Suspense>
    </ErrorBoundary>
  )
}

interface ExperienceDetailContentProps {
  projectId: string
}
const ExperienceDetailContent = ({ projectId }: ExperienceDetailContentProps) => {
  const workspaceId = useWorkspaceId()
  const { project } = useProject(workspaceId, projectId)
  const { experiences } = useProjectExperiences(workspaceId, projectId)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedExperience = experiences.find((experience) => experience.experienceId === selectedId) ?? null

  const projectMeta = getProjectMeta(project)

  const handleSelect = (experienceId: string) => {
    setSelectedId((prev) => (prev === experienceId ? null : experienceId))
  }

  return (
    <Flex className="h-screen">
      <Flex direction="column" className="h-full flex-1 overflow-y-auto p-8">
        <Flex direction="column" className={cn('w-full gap-8', selectedExperience ? 'max-w-full' : 'max-w-198.75')}>
          <Flex direction="column" className="gap-2">
            <Text variant="heading2" color="text-basic">
              경험정리
            </Text>
            <Text variant="body1" color="text-subtler">
              경험을 정리해서 이력서 소재로 활용해요.
            </Text>
          </Flex>

          <ProjectInfoCard workspaceId={workspaceId} project={project} />

          <ExperienceListSection
            workspaceId={workspaceId}
            projectId={projectId}
            experiences={experiences}
            projectMeta={projectMeta}
            expanded={selectedExperience !== null}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </Flex>
      </Flex>

      {selectedExperience && (
        <ExperienceDetailPanel
          key={selectedExperience.experienceId}
          workspaceId={workspaceId}
          projectId={projectId}
          experienceId={selectedExperience.experienceId}
          title={selectedExperience.title}
          projectMeta={projectMeta}
          keywords={selectedExperience.tags}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Flex>
  )
}

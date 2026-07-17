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
import { ProjectInfo } from './ProjectInfo'
import { ExperienceList } from './ExperienceList'
import { ExperienceDetailPanel } from './ExperienceDetailPanel'

export const ExperienceDetailPage = () => {
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
        <ExperienceDetailContent />
      </Suspense>
    </ErrorBoundary>
  )
}

const ExperienceDetailContent = () => {
  const workspaceId = useWorkspaceId()
  const { projectId } = useParams<{ projectId: string }>()
  const { project } = useProject(workspaceId, projectId)
  const { experiences } = useProjectExperiences(workspaceId, projectId)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedExperience = experiences.find((experience) => experience.experienceId === selectedId) ?? null

  const handleSelect = (experienceId: string) => {
    setSelectedId((prev) => (prev === experienceId ? null : experienceId))
  }

  return (
    <Flex className="h-screen">
      <Flex direction="column" className="h-full flex-1 overflow-y-auto p-8">
        <Flex direction="column" gap="8" className={cn('w-full', selectedExperience ? 'max-w-full' : 'max-w-198.75')}>
          <Flex direction="column" gap="2">
            <Text variant="heading2" color="text-basic">
              경험정리
            </Text>
            <Text variant="body1" color="text-subtler">
              경험을 정리해서 이력서 소재로 활용해요.
            </Text>
          </Flex>
          <ProjectInfo workspaceId={workspaceId} project={project} />
          <ExperienceList experiences={experiences} expanded={selectedExperience !== null} selectedId={selectedId} onSelect={handleSelect} />
        </Flex>
      </Flex>

      {selectedExperience && <ExperienceDetailPanel workspaceId={workspaceId} experienceId={selectedExperience.experienceId} onClose={() => setSelectedId(null)} />}
    </Flex>
  )
}

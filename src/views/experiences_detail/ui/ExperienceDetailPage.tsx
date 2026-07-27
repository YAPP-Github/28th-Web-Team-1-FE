'use client'
import { Suspense, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Flex } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
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
      <Suspense fallback={null}>
        <ExperienceDetailContent />
      </Suspense>
    </ErrorBoundary>
  )
}
const ExperienceDetailContent = () => {
  const workspaceId = useWorkspaceId()
  const { projectId } = useParams<{ projectId: string }>()
  const searchParams = useSearchParams()
  const { project } = useProject(workspaceId, projectId)
  const { experiences } = useProjectExperiences(workspaceId, projectId)

  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get('experienceId'))
  const selectedExperience = experiences.find((experience) => experience.experienceId === selectedId) ?? null

  const handleSelect = (experienceId: string) => {
    setSelectedId(experienceId)
  }

  return (
    <Flex className="h-screen overflow-x-hidden">
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

      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            key="detail-panel"
            className="h-screen shrink-0"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExperienceDetailPanel workspaceId={workspaceId} experienceId={selectedExperience.experienceId} onClose={() => setSelectedId(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}

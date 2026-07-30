'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { Flex, Grid } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { ArrowRight } from 'lucide-react'
import { useProjectList } from '@entities/project'
import { useWorkspaceId } from '@entities/user'
import { formatPeriod } from '@shared/lib'
import { Button, Text } from '@shared/ui'
import { ExperiencesSearchField } from './ExperiencesSearchField'
import { AddProjectDialog } from './AddProjectDialog'

export const ExperiencesPage = () => {
  return (
    <Flex direction="column" gap="8" className="h-screen overflow-y-auto p-8">
      <Flex direction="column" gap="2">
        <Text variant="heading2" color="text-basic">
          경험정리
        </Text>
        <Text variant="body1" color="text-subtler">
          경험을 정리해서 이력서 소재로 활용해요.
        </Text>
      </Flex>
      <ErrorBoundary
        fallback={
          <Flex align="center" justify="center" className="py-20">
            <Text variant="body1" color="text-subtler">
              불러오는데 실패했습니다.
            </Text>
          </Flex>
        }
      >
        <Suspense fallback={null}>
          <Flex direction="row" gap="4" justify="between">
            <ExperiencesSearchField />
            <AddProjectDialog />
          </Flex>
          <ExperiencesProjectGrid />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

const ExperiencesProjectGrid = () => {
  const workspaceId = useWorkspaceId()
  const { projects } = useProjectList(workspaceId)

  if (projects.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" className="border-border-subtle h-129 rounded-lg border border-dashed" gap="3">
        <Text variant="headline2" color="text-basic">
          아직 작성된 프로젝트가 없어요.
        </Text>
        <Text variant="body2" color="text-subtler">
          {"오른쪽 상단의 '경험 추가하기'를 눌러 첫 프로젝트를 만들어 보세요."}
        </Text>
      </Flex>
    )
  }

  return (
    <Grid columns="4" gapX="4" gapY="6">
      {projects.map((project) => (
        <Link key={project.projectId} href={`/experiences/${project.projectId}`} className="w-full">
          <Flex direction="column" gap="3" className="group pointer-cursor">
            <div className="bg-element-primary-lighter group-hover:border-btn-secondary-border h-25 w-full rounded-lg transition-all group-hover:border" />
            <Flex direction="column" gap="1">
              <Text variant="caption1" color="text-subtler">
                {formatPeriod(project.period?.startAt, project.period?.endAt, 'YYYY.MM') || '-'}
              </Text>
              <Text variant="headline2" className="text-text-basic group-hover:text-text-primary-basic transition-colors">
                {project.name}
              </Text>
            </Flex>
          </Flex>
        </Link>
      ))}
      <ResumeCtaCard />
    </Grid>
  )
}

const ResumeCtaCard = () => (
  <Link href="/home" className="w-full">
    <Flex
      direction="column"
      align="end"
      p="3"
      className="group border-border-subtler bg-element-white hover:border-btn-secondary-border hover:bg-element-gray-lighter gap-0.5 rounded-lg border transition-colors"
    >
      <Flex direction="column" className="w-full gap-0.5">
        <Text variant="label1" color="text-subtle">
          정리한 경험을 바탕으로
        </Text>
        <Flex align="center">
          <Text variant="label1" color="text-primary-basic">
            이력서
          </Text>
          <Text variant="label1" color="text-subtle">
            를 만들어 보세요.
          </Text>
        </Flex>
      </Flex>
      <Button variant="tertiary" size="xs" asChild className="group-hover:bg-btn-primary-fill-hovered group-hover:text-text-bolder-inverse transition-colors">
        <span>
          이력서 만들기
          <ArrowRight data-icon="inline-end" />
        </span>
      </Button>
    </Flex>
  </Link>
)

'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Flex, Grid } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { useExperienceProjectList } from '@entities/experience'
import { Text } from '@shared/ui'
import { ExperiencesSearchField } from './ExperiencesSearchField'
import { AddProjectDialog } from './AddProjectDialog'

/** `"2025-05"` / `"2025.05"` 값을 `"2025.05"`로 표기한다. 값이 없으면 빈 문자열. */
const formatYearMonth = (value?: string | null) => {
  if (!value) return ''
  const [year, month] = value.split(/[-.]/)
  return month ? `${year}.${month}` : year
}
/** `{ startAt, endAt }`를 `"2025.05 - 2025.08"` 형태로 표기한다. */
const formatPeriod = (period?: { startAt?: string | null; endAt?: string | null } | null) => {
  if (!period) return ''
  const start = formatYearMonth(period.startAt)
  const end = formatYearMonth(period.endAt)
  return start && end ? `${start} - ${end}` : start || end
}

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
      <Flex direction="row" gap="4" justify="between">
        <ExperiencesSearchField />
        <AddProjectDialog />
      </Flex>
      <ErrorBoundary
        fallback={
          <Flex align="center" justify="center" className="py-20">
            <Text variant="body1" color="text-subtler">
              프로젝트 목록을 불러오는데 실패했습니다.
            </Text>
          </Flex>
        }
      >
        <Suspense
          fallback={
            <Flex direction="column" align="center" justify="center" className="border-border-subtle h-129 rounded-lg border border-dashed" gap="3">
              <Text variant="headline2" color="text-basic">
                로딩중
              </Text>
              <Text variant="body2" color="text-subtler">
                디자인 시안을 기다리고있어요
              </Text>
            </Flex>
          }
        >
          <ExperiencesProjectGrid />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

const ExperiencesProjectGrid = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { projects } = useExperienceProjectList(workspaceId)

  if (projects.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" className="border-border-subtle h-129 rounded-lg border border-dashed" gap="3">
        <Text variant="headline2" color="text-basic">
          아직 작성된 프로젝트가 없어요.
        </Text>
        <Text variant="body2" color="text-subtler">
          {"오른쪽 상단의 '프로젝트 추가하기'를 눌러 첫 프로젝트를 만들어 보세요."}
        </Text>
      </Flex>
    )
  }

  return (
    <Grid columns="4" gapX="4" gapY="6">
      {projects.map((project) => (
        <Link key={project.projectId} href={`/workspace/${workspaceId}/experiences/${project.projectId}`} className="w-full">
          <Flex direction="column" gap="3" className="group pointer-cursor">
            <div className="bg-element-primary-lighter group-hover:border-btn-secondary-border h-25 w-full rounded-lg transition-all group-hover:border" />
            <Flex direction="column" gap="1">
              <Text variant="caption1" color="text-subtler">
                {/** TODO : 프로젝트 생성 시 기간 설정 여부를 기획에서 정해지면 수정 필요 */}
                {project.period ? formatPeriod(project.period) : '기간 미정'}
              </Text>
              <Text variant="headline2" className="text-text-basic group-hover:text-text-primary-basic transition-colors">
                {project.name}
              </Text>
            </Flex>
          </Flex>
        </Link>
      ))}
    </Grid>
  )
}

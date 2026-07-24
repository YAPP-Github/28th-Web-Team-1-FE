'use client'

import { Suspense, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { SearchField, Spacing, Text } from '@shared/ui'
import { useMatchedExperiences } from '@entities/experience'
import { ProjectFilter, PROJECT_FILTER, type ProjectFilterValue, ProjectFilterLoading } from './ProjectFilter'
import { ExperienceCard, ExperienceCardSkeleton } from './ExperienceCard'
import type { Experience } from '../model/experience.types'

interface Props {
  workspaceId: string
  jdId: string
  isSelected: (experienceId: string) => boolean
  isFull: boolean
  onToggle: (experience: Experience) => void
}

export const ExperienceSearchPanel = ({ workspaceId, jdId, isSelected, isFull, onToggle }: Props) => {
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<ProjectFilterValue>(PROJECT_FILTER.recommended)

  return (
    <Flex direction="column" flexShrink={'0'} className={'bg-bg-white w-107 min-w-107 rounded-xl p-6'}>
      <SearchField size={'sm'} placeholder={'경험명 또는 역량 키워드를 검색해 보세요.'} value={search} onChange={(event) => setSearch(event.target.value)} />

      <Spacing size={20} />

      <Suspense fallback={<ProjectFilterLoading />}>
        <ProjectFilter value={projectFilter} onChange={setProjectFilter} />
      </Suspense>

      <Spacing size={12} />

      <Suspense fallback={<ExperienceListLoading />}>
        <ExperienceList workspaceId={workspaceId} jdId={jdId} search={search} projectFilter={projectFilter} isSelected={isSelected} isFull={isFull} onToggle={onToggle} />
      </Suspense>
    </Flex>
  )
}

interface ExperienceListProps {
  workspaceId: string
  jdId: string
  search: string
  projectFilter: ProjectFilterValue
  isSelected: (experienceId: string) => boolean
  isFull: boolean
  onToggle: (experience: Experience) => void
}

const ExperienceList = ({ workspaceId, jdId, search, projectFilter, isSelected, isFull, onToggle }: ExperienceListProps) => {
  const { experiences } = useMatchedExperiences(workspaceId, jdId)
  const browseList = sortByMatchRateDesc(experiences)
  const filtered = browseList.filter((experience) => matchesSearch(experience, search) && matchesProject(experience, projectFilter))

  if (filtered.length === 0) {
    if (projectFilter !== PROJECT_FILTER.recommended) {
      return (
        <Flex direction={'column'} align={'center'} className={'m-auto'}>
          <Text variant={'label1'} color={'text-subtle'}>
            채용 공고와 맞는 경험을 찾지 못했어요
          </Text>
          <Text variant={'caption1'} color={'text-subtler'}>
            관련 경험을 추가하거나 다른 경험을 선택해보세요
          </Text>
        </Flex>
      )
    }

    return (
      <Flex direction={'column'} align={'center'} className={'m-auto'}>
        <Text variant={'label1'} color={'text-subtle'}>
          프로젝트에 등록된 경험이 없어요
        </Text>
        <Text variant={'caption1'} color={'text-subtler'}>
          관련 경험을 추가해 주세요
        </Text>
      </Flex>
    )
  }

  return (
    <Flex direction={'column'} gap={'2'} minHeight={'0'} flexGrow={'1'} className={'overflow-y-auto'}>
      {filtered.map((experience) => (
        <ExperienceCard
          key={experience.experienceId}
          experience={experience}
          checked={isSelected(experience.experienceId)}
          disabled={isFull && !isSelected(experience.experienceId)}
          onCheckedChange={() => onToggle(experience)}
          showReason={projectFilter === PROJECT_FILTER.recommended}
        />
      ))}
    </Flex>
  )
}

const ExperienceListLoading = () => (
  <Flex direction={'column'} gap={'2'} minHeight={'0'} flexGrow={'1'} className={'overflow-hidden'}>
    {[0, 1, 2].map((i) => (
      <ExperienceCardSkeleton key={i} />
    ))}
  </Flex>
)

/** 매칭률 내림차순 정렬 (원본 불변, matchRate 없으면 맨 뒤) */
const sortByMatchRateDesc = (experiences: Experience[]): Experience[] => [...experiences].sort((a, b) => (b.matchRate ?? 0) - (a.matchRate ?? 0))

/** 검색어가 경험명(title) 또는 역량(tags)에 걸리는지 */
const matchesSearch = (experience: Experience, query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return experience.title.toLowerCase().includes(q) || experience.tags.some((tag) => tag.toLowerCase().includes(q))
}

/** 추천 = recommendedReason 보유 / 전체 = 전부 / 그 외 = 같은 projectId */
const matchesProject = (experience: Experience, filter: ProjectFilterValue) => {
  if (filter === PROJECT_FILTER.all) return true
  if (filter === PROJECT_FILTER.recommended) return Boolean(experience.recommendedReason)
  return experience.project?.projectId === filter
}

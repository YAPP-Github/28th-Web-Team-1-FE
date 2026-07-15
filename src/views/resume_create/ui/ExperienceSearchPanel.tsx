'use client'

import { Flex } from '@radix-ui/themes'
import { SearchField, Spacing } from '@shared/ui'
import { useState } from 'react'
import { ProjectFilter, PROJECT_FILTER, type ProjectFilterValue } from './ProjectFilter'
import { ExperienceCard } from './ExperienceCard'
import type { Experience } from '../model/experience.types'

interface Props {
  experiences: Experience[]
  selectedIds: ReadonlySet<string>
  isFull: boolean
  onToggle: (experienceId: string) => void
}

export const ExperienceSearchPanel = ({ experiences, selectedIds, isFull, onToggle }: Props) => {
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<ProjectFilterValue>(PROJECT_FILTER.recommended)

  const filtered = experiences.filter((experience) => matchesSearch(experience, search) && matchesProject(experience, projectFilter))

  return (
    <Flex direction="column" flexGrow={'1'} className={'bg-bg-white w-107 min-w-107 rounded-xl p-6'}>
      <SearchField size={'sm'} placeholder={'경험명 또는 역량 키워드를 검색해 보세요.'} value={search} onChange={(event) => setSearch(event.target.value)} />

      <Spacing size={20} />

      <ProjectFilter value={projectFilter} onChange={setProjectFilter} />

      <Spacing size={12} />

      <Flex direction={'column'} gap={'2'} minHeight={'0'} flexGrow={'1'} className={'overflow-y-auto'}>
        {filtered.map((experience) => (
          <ExperienceCard
            key={experience.experienceId}
            experience={experience}
            checked={selectedIds.has(experience.experienceId)}
            disabled={isFull && !selectedIds.has(experience.experienceId)}
            onCheckedChange={() => onToggle(experience.experienceId)}
            showReason
          />
        ))}
      </Flex>
    </Flex>
  )
}

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

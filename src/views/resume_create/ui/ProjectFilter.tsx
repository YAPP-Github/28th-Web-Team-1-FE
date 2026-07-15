'use client'

import { useRef } from 'react'
import { Flex } from '@radix-ui/themes'
import { Button } from '@shared/ui'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { useWorkspaceId } from '@entities/user'
import { useProjectFilterOptions } from '@entities/project'

/** 'recommended' | 'all' | projectId */
export type ProjectFilterValue = string

export const PROJECT_FILTER = {
  recommended: 'recommended',
  all: 'all'
} as const

interface Props {
  value: ProjectFilterValue
  onChange: (value: ProjectFilterValue) => void
}

export const ProjectFilter = ({ value, onChange }: Props) => {
  const workspaceId = useWorkspaceId()
  const { projects, fetchNextPage, hasNextPage, isFetchingNextPage } = useProjectFilterOptions(workspaceId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    root: scrollRef,
    // 끝에서 120px 앞서 미리 다음 페이지를 당겨와 스크롤이 끊기지 않게 한다.
    rootMargin: '0px 120px 0px 0px',
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage
  })

  const variant = (target: ProjectFilterValue) => (value === target ? 'primary' : 'tertiary')

  return (
    <Flex ref={scrollRef} gap={'1'} className={'overflow-x-auto'} flexShrink={'0'}>
      <Button variant={variant(PROJECT_FILTER.recommended)} size={'xs'} onClick={() => onChange(PROJECT_FILTER.recommended)}>
        추천
      </Button>
      <Button variant={variant(PROJECT_FILTER.all)} size={'xs'} onClick={() => onChange(PROJECT_FILTER.all)}>
        전체
      </Button>
      {projects.map((project) => (
        <Button key={project.projectId} variant={variant(project.projectId)} size={'xs'} onClick={() => onChange(project.projectId)}>
          {project.name}
        </Button>
      ))}
      {hasNextPage && <div ref={sentinelRef} aria-hidden className={'w-px shrink-0'} />}
    </Flex>
  )
}

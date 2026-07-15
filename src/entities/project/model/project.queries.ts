'use client'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { projectQueries } from './project.keys'

export const useProjectFilterOptions = (workspaceId?: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...projectQueries.filterOptions(workspaceId ?? ''),
    select: (data) => data.pages.flatMap((page) => page.experienceProjects.projects)
  })
  return { projects: data ?? [], ...rest }
}

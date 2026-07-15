import { execute, graphql } from '@shared/lib'

export const projectAPI = {
  getProjectFilterOptions: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(projectFilterOptionsDocument, variables)
}

/**
 * 프로젝트 목록에 필요한 최소 필드(id + 이름)
 */
export const projectListItemFragment = graphql(`
  fragment ProjectListItem on ExperienceProject {
    projectId
    name
  }
`)

const projectFilterOptionsDocument = graphql(`
  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {
    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      projects {
        ...ProjectListItem
      }
    }
  }
`)

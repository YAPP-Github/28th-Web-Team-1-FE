import { execute, graphql } from '@shared/lib'

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables),
  getSearchExperiences: (variables: { workspaceId: string; keyword: string; size: number; cursor?: string | null }) => execute(searchExperiencesDocument, variables)
}

const experiencesDocument = graphql(`
  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {
    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        project {
          projectId
          name
          role
          period {
            startAt
            endAt
          }
        }
      }
    }
  }
`)

const searchExperiencesDocument = graphql(`
  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {
    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        project {
          projectId
          name
        }
      }
    }
  }
`)

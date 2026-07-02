import { execute, graphql } from '@/src/shared/lib'

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
        }
      }
    }
  }
`)

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables)
}

import { execute, graphql } from '@shared/lib'

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables),
  getSearchExperiences: (variables: { workspaceId: string; keyword: string; size: number; cursor?: string | null }) => execute(searchExperiencesDocument, variables),
  getMatchedExperiences: (variables: { workspaceId: string; jdId: string; size: number; cursor?: string | null }) => execute(matchedExperiencesDocument, variables)
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

/** JD 매칭 조회용. jdId 기준 matchRate와 상위 5개 recommendedReason(= reason)이 함께 내려온다. */
const matchedExperiencesDocument = graphql(`
  query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {
    experiences(workspaceId: $workspaceId, jdId: $jdId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        matchRate
        recommendedReason: reason
        contents {
          type
          free {
            content
          }
          star {
            situation
            task
            action
            result
          }
        }
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

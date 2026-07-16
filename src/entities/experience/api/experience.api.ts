import { execute, graphql } from '@shared/lib'
import type { CreateExperienceInput, UpdateExperienceInput } from '../model/experience.types'

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables),
  getMatchedExperiences: (variables: { workspaceId: string; jdId: string; size: number; cursor?: string | null }) => execute(matchedExperiencesDocument, variables),
  getProjectExperiences: (variables: { workspaceId: string; projectId: string; size: number; cursor?: string | null }) => execute(projectExperiencesDocument, variables),
  getExperience: (variables: { workspaceId: string; experienceId: string }) => execute(experienceDocument, variables),
  getSearchExperiences: (variables: { workspaceId: string; keyword: string; size: number; cursor?: string | null }) => execute(searchExperiencesDocument, variables),
  createExperience: (variables: { workspaceId: string; request: CreateExperienceInput }) => execute(createExperienceDocument, variables),
  updateExperience: (variables: { workspaceId: string; experienceId: string; request: UpdateExperienceInput }) => execute(updateExperienceDocument, variables),
  deleteExperience: (variables: { workspaceId: string; experienceId: string }) => execute(deleteExperienceDocument, variables)
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

const projectExperiencesDocument = graphql(`
  query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String) {
    experiences(workspaceId: $workspaceId, projectId: $projectId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
      }
    }
  }
`)

const experienceDocument = graphql(`
  query Experience($workspaceId: ID!, $experienceId: ID!) {
    experience(workspaceId: $workspaceId, experienceId: $experienceId) {
      experienceId
      title
      tags
      contents {
        type
        star {
          situation
          task
          action
          result
        }
        free {
          content
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
const createExperienceDocument = graphql(`
  mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {
    createExperience(workspaceId: $workspaceId, request: $request) {
      experienceId
    }
  }
`)

const updateExperienceDocument = graphql(`
  mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {
    updateExperience(workspaceId: $workspaceId, experienceId: $experienceId, request: $request) {
      experienceId
    }
  }
`)

const deleteExperienceDocument = graphql(`
  mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {
    deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)
  }
`)

import { execute, graphql } from '@shared/lib'
import type { CreateExperienceProjectInput } from '../model/experience.types'

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables),
  getExperienceProjects: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experienceProjectsDocument, variables),
  getSearchExperiences: (variables: { workspaceId: string; keyword: string; size: number; cursor?: string | null }) => execute(searchExperiencesDocument, variables),
  createExperienceProject: (variables: { workspaceId: string; input: CreateExperienceProjectInput }) => execute(createExperienceProjectDocument, variables)
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
        }
      }
    }
  }
`)

const experienceProjectsDocument = graphql(`
  query ExperienceProjects($workspaceId: ID!, $size: Int!, $cursor: String) {
    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      projects {
        projectId
        name
        period {
          startAt
          endAt
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

const createExperienceProjectDocument = graphql(`
  mutation CreateExperienceProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {
    createExperienceProject(workspaceId: $workspaceId, input: $input) {
      projectId
      name
      summary
      role
      period {
        startAt
        endAt
      }
    }
  }
`)

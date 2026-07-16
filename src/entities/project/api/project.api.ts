import { execute, graphql, http } from '@shared/lib'
import type { CreateProjectInput, UpdateProjectInput } from '../model/project.types'

export const projectAPI = {
  getProjects: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(projectsDocument, variables),
  getProject: (variables: { workspaceId: string; projectId: string }) => execute(projectDocument, variables),
  createProject: (variables: { workspaceId: string; input: CreateProjectInput }) => execute(createProjectDocument, variables),
  updateProject: (variables: { workspaceId: string; projectId: string; request: UpdateProjectInput }) => execute(updateProjectDocument, variables),
  deleteProject: (variables: { workspaceId: string; projectId: string }) => execute(deleteProjectDocument, variables),
  createProjectFromPdf: (variables: { workspaceId: string; pdfFile: File }) => {
    const formData = new FormData()
    /** MIME 타입을 'application/pdf'로 정규화합니다. (한컴오피스 등 비표준 타입 대응) */
    formData.append('file', new File([variables.pdfFile], variables.pdfFile.name, { type: 'application/pdf' }))
    return http.post(`/api/v1/workspaces/${variables.workspaceId}/experience-imports`, { body: formData })
  },
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

const projectsDocument = graphql(`
  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {
    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
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

const projectDocument = graphql(`
  query Project($workspaceId: ID!, $projectId: ID!) {
    project: experienceProject(workspaceId: $workspaceId, projectId: $projectId) {
      projectId
      name
      role
      summary
      period {
        startAt
        endAt
      }
    }
  }
`)

const createProjectDocument = graphql(`
  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {
    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {
      projectId
      name
      summary
      period {
        startAt
        endAt
      }
    }
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
const updateProjectDocument = graphql(`
  mutation UpdateProject($workspaceId: ID!, $projectId: ID!, $request: UpdateExperienceProjectRequest!) {
    updateProject: updateExperienceProject(workspaceId: $workspaceId, projectId: $projectId, request: $request) {
      projectId
      name
      role
      summary
      period {
        startAt
        endAt
      }
    }
  }
`)

const deleteProjectDocument = graphql(`
  mutation DeleteProject($workspaceId: ID!, $projectId: ID!) {
    deleteExperienceProject(workspaceId: $workspaceId, projectId: $projectId)
  }
`)

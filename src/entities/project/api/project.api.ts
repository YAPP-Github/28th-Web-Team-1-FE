import { execute, graphql, http } from '@shared/lib'
import type { CreateProjectInput } from '../model/project.types'

export const projectAPI = {
  getProjects: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(projectsDocument, variables),
  createProject: (variables: { workspaceId: string; input: CreateProjectInput }) => execute(createProjectDocument, variables),
  createProjectFromPdf: (variables: { workspaceId: string; pdfFile: File }) => {
    const formData = new FormData()
    /** MIME 타입을 'application/pdf'로 정규화합니다. (한컴오피스 등 비표준 타입 대응) */
    formData.append('file', new File([variables.pdfFile], variables.pdfFile.name, { type: 'application/pdf' }))
    return http.post(`/api/v1/workspaces/${variables.workspaceId}/experience-imports`, { body: formData })
  }
}

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

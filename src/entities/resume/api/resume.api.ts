import { execute, graphql } from '@shared/lib'
import { type CreateResumeInput } from '@shared/lib/gql/graphql'

export const resumeAPI = {
  createResume: (variables: { workspaceId: string; input: CreateResumeInput }) => execute(createResumeDocument, variables)
}

const createResumeDocument = graphql(`
  mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {
    createResume(workspaceId: $workspaceId, input: $input) {
      resumeId
    }
  }
`)

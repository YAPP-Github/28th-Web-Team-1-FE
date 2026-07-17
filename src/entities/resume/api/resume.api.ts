import { execute, graphql } from '@shared/lib'
import { type SaveResumeInput } from '@shared/lib/gql/graphql'

export const resumeAPI = {
  createResume: (variables: { workspaceId: string; input: SaveResumeInput }) => execute(createResumeDocument, variables)
}

const createResumeDocument = graphql(`
  mutation CreateResume($workspaceId: ID!, $input: SaveResumeInput!) {
    createResume(workspaceId: $workspaceId, input: $input) {
      resumeId
    }
  }
`)

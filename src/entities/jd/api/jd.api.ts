import { execute, graphql } from '@shared/lib'
import { type JdRegisterInput } from '../model/jd.types'

export const jdAPI = {
  getJdInsight: (variables: { workspaceId: string; jdId: string }) => execute(jdInsightDocument, variables),
  getJdMeta: (variables: { workspaceId: string; jdId: string }) => execute(jdMetaDocument, variables),
  getJdDetail: (variables: { workspaceId: string; jdId: string }) => execute(jdDetailDocument, variables),
  registerJd: (variables: { workspaceId: string; request: JdRegisterInput }) => execute(registerJdDocument, variables)
}

const jdInsightDocument = graphql(`
  query JdInsight($workspaceId: ID!, $jdId: ID!) {
    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {
      keyPoints
      strategy
    }
  }
`)

const jdMetaDocument = graphql(`
  query JdMeta($workspaceId: ID!, $jdId: ID!) {
    jd(workspaceId: $workspaceId, id: $jdId) {
      companyName
      positionTitle
    }
  }
`)

const jdDetailDocument = graphql(`
  query JdDetail($workspaceId: ID!, $jdId: ID!) {
    jd(workspaceId: $workspaceId, id: $jdId) {
      companyIntro
      responsibilities
      requiredExperiences
      preferredExperiences
      hiringProcess
    }
  }
`)

const registerJdDocument = graphql(`
  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {
    registerJd(workspaceId: $workspaceId, request: $request) {
      jd {
        jdId
      }
      candidates {
        title
        body
      }
    }
  }
`)

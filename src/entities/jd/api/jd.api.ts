import { execute, graphql } from '@shared/lib'
import type { RegisterJdMutation } from '@shared/lib/gql/graphql'

/** JD 등록/게스트 분석 입력입니다. sourceUrl(크롤) 또는 body(붙여넣기) 중 정확히 하나를 채웁니다. */
export interface JdRegisterInput {
  sourceUrl?: string | null
  body?: string | null
}

/** JD 등록 결과가 다중 공고일 때 채워지는 후보 항목입니다. */
export type JdCandidate = NonNullable<RegisterJdMutation['registerJd']['candidates']>[number]

export const jdAPI = {
  getJdInsight: (variables: { workspaceId: string; jdId: string }) => execute(jdInsightDocument, variables),
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

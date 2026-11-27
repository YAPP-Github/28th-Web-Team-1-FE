import { execute, graphql, http } from '@shared/lib'
import type { AgreeSignupConsentsRequest, UpdateOptionalConsentsRequest } from '@shared/lib/gql/graphql'

export const userAPI = {
  getUserWorkspaces: () => execute(userWorkspacesDocument),
  getMe: () => execute(myUserDocument),
  withdraw: () => http.delete('/api/v1/auth/withdrawal'),
  agreeSignupConsents: (request: AgreeSignupConsentsRequest) => execute(agreeSignupConsentsDocument, { request }),
  updateOptionalConsents: (request: UpdateOptionalConsentsRequest) => execute(updateOptionalConsentsDocument, { request }),
  markConsentSheetShown: () => execute(markConsentSheetShownDocument)
}

const myUserDocument = graphql(`
  query Me {
    me {
      userId
      name
      profileImageUrl
      email
      workspaces {
        workspaceId
      }
      consentSheetRequired
      consents {
        type
        agreed
        changedAt
      }
    }
  }
`)

const userWorkspacesDocument = graphql(`
  query UserWorkspaces {
    me {
      workspaces {
        workspaceId
      }
    }
  }
`)

const agreeSignupConsentsDocument = graphql(`
  mutation AgreeSignupConsents($request: AgreeSignupConsentsRequest!) {
    agreeSignupConsents(request: $request) {
      type
      agreed
      changedAt
    }
  }
`)

const updateOptionalConsentsDocument = graphql(`
  mutation UpdateOptionalConsents($request: UpdateOptionalConsentsRequest!) {
    updateOptionalConsents(request: $request) {
      type
      agreed
      changedAt
    }
  }
`)

const markConsentSheetShownDocument = graphql(`
  mutation MarkConsentSheetShown {
    markConsentSheetShown
  }
`)

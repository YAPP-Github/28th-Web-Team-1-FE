import { execute, graphql, http } from '@shared/lib'

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

export const userAPI = {
  getUserWorkspaces: () => execute(userWorkspacesDocument),
  getMe: () => execute(myUserDocument),
  withdraw: () => http.delete('/api/v1/auth/withdrawal')
}

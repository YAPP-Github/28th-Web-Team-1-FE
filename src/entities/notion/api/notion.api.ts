import { execute, graphql } from '@shared/lib'

export const notionAPI = {
  connectNotion: (variables: { workspaceId: string; request: { authorizationCode: string; redirectUri: string } }) => execute(connectNotionDocument, variables),
  getConnections: ({ workspaceId, size = 10 }: { workspaceId: string; size?: number }) => execute(notionConnectionsDocument, { workspaceId, size }),
  getPages: ({ workspaceId, connectionId, query = null, size = 10 }: { workspaceId: string; connectionId: string; query?: string | null; size?: number }) =>
    execute(notionPagesDocument, { workspaceId, connectionId, query, size }),
  importExperience: (variables: { workspaceId: string; request: { connectionId: string; pageId: string } }) => execute(importNotionExperiencesDocument, variables)
}

const connectNotionDocument = graphql(`
  mutation ConnectNotion($workspaceId: ID!, $request: ConnectNotionRequest!) {
    connectNotion(workspaceId: $workspaceId, request: $request) {
      connectionId
      notionWorkspaceName
      notionWorkspaceIcon
    }
  }
`)

const notionConnectionsDocument = graphql(`
  query NotionConnections($workspaceId: ID!, $size: Int!) {
    notionConnections(workspaceId: $workspaceId, size: $size) {
      connections {
        connectionId
        notionWorkspaceName
        notionWorkspaceIcon
      }
      cursor {
        hasNext
        nextCursor
      }
    }
  }
`)

const notionPagesDocument = graphql(`
  query NotionPages($workspaceId: ID!, $connectionId: ID!, $query: String, $size: Int!) {
    notionPages(workspaceId: $workspaceId, connectionId: $connectionId, query: $query, size: $size) {
      pages {
        pageId
        title
        url
        lastEditedTime
      }
      cursor {
        hasNext
        nextCursor
      }
    }
  }
`)

const importNotionExperiencesDocument = graphql(`
  mutation ImportNotionExperiences($workspaceId: ID!, $request: NotionExperienceImportRequest!) {
    importNotionExperiences(workspaceId: $workspaceId, request: $request)
  }
`)

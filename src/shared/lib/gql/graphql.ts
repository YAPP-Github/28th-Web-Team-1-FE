/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type ExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, project: { projectId: string, name: string, role: string | null, period: { startAt: string | null, endAt: string | null } | null } | null }> } };

export type ExperienceProjectsQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ExperienceProjectsQuery = { experienceProjects: { cursor: { hasNext: boolean, nextCursor: string | null }, projects: Array<{ projectId: string, name: string, summary: string, role: string | null, experienceCount: number | null, period: { startAt: string | null, endAt: string | null } | null }> } };

export type ExperienceProjectQueryVariables = Exact<{
  id: string | number;
  workspaceId: string | number;
}>;


export type ExperienceProjectQuery = { experienceProject: { projectId: string, name: string, summary: string, role: string | null, experienceCount: number | null, period: { startAt: string | null, endAt: string | null } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { userId: string, name: string, profileImageUrl: string | null, email: string, workspaces: Array<{ workspaceId: string }> } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const ExperiencesDocument = new TypedDocumentString(`
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
        role
        period {
          startAt
          endAt
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ExperiencesQuery, ExperiencesQueryVariables>;
export const ExperienceProjectsDocument = new TypedDocumentString(`
    query ExperienceProjects($workspaceId: ID!, $size: Int!, $cursor: String) {
  experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
    cursor {
      hasNext
      nextCursor
    }
    projects {
      projectId
      name
      summary
      role
      experienceCount
      period {
        startAt
        endAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ExperienceProjectsQuery, ExperienceProjectsQueryVariables>;
export const ExperienceProjectDocument = new TypedDocumentString(`
    query ExperienceProject($id: ID!, $workspaceId: ID!) {
  experienceProject(id: $id, workspaceId: $workspaceId) {
    projectId
    name
    summary
    role
    experienceCount
    period {
      startAt
      endAt
    }
  }
}
    `) as unknown as TypedDocumentString<ExperienceProjectQuery, ExperienceProjectQueryVariables>;
export const MeDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
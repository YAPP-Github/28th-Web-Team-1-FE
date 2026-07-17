/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** 경험 프로젝트 생성 입력입니다. */
export type CreateExperienceProjectRequest = {
  /** 경험 프로젝트 이름입니다. */
  name: string;
  /** 경험 프로젝트 진행 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 경험 프로젝트 역할입니다. */
  role?: string | null | undefined;
  /** 경험 프로젝트 요약입니다. */
  summary: string;
};

/** 경험 상세 내용 타입입니다. */
export type ExperienceContentsType =
  /** 자유 서술 형식입니다. */
  | 'FREE'
  /** Situation, Task, Action, Result로 구성된 형식입니다. */
  | 'STAR';

/** JD 등록 입력입니다. sourceUrl 또는 body 중 정확히 하나여야 합니다. */
export type JdRegisterRequest = {
  /** 붙여넣은 JD 본문입니다. (붙여넣기 등록) */
  body?: string | null | undefined;
  /** 등록할 JD 공고의 URL입니다. (크롤 등록) */
  sourceUrl?: string | null | undefined;
};

/** 기간 입력입니다. */
export type PeriodInput = {
  /** 기간 종료일입니다. */
  endAt?: string | null | undefined;
  /** 기간 시작일입니다. */
  startAt?: string | null | undefined;
};

export type ExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, project: { projectId: string, name: string, role: string | null, period: { startAt: string | null, endAt: string | null } | null } | null }> } };

export type SearchExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  keyword: string;
  size: number;
  cursor?: string | null | undefined;
}>;


export type SearchExperiencesQuery = { searchExperiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, project: { projectId: string, name: string } | null }> } };

export type MatchedExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  jdId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type MatchedExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, matchRate: number | null, recommendedReason: string | null, contents: { type: ExperienceContentsType, free: { content: string } | null, star: { situation: string, task: string, action: string, result: string } | null }, project: { projectId: string, name: string, role: string | null, period: { startAt: string | null, endAt: string | null } | null } | null }> } };

export type JdInsightQueryVariables = Exact<{
  workspaceId: string | number;
  jdId: string | number;
}>;


export type JdInsightQuery = { jdInsight: { keyPoints: string, strategy: string } | null };

export type RegisterJdMutationVariables = Exact<{
  workspaceId: string | number;
  request: JdRegisterRequest;
}>;


export type RegisterJdMutation = { registerJd: { jd: { jdId: string } | null, candidates: Array<{ title: string, body: string }> | null } };

export type ProjectListItemFragment = { projectId: string, name: string };

export type ProjectsQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ProjectsQuery = { projectList: { cursor: { hasNext: boolean, nextCursor: string | null }, projects: Array<{ projectId: string, name: string, period: { startAt: string | null, endAt: string | null } | null }> } };

export type CreateProjectMutationVariables = Exact<{
  workspaceId: string | number;
  input: CreateExperienceProjectRequest;
}>;


export type CreateProjectMutation = { createProject: { projectId: string, name: string, summary: string, period: { startAt: string | null, endAt: string | null } | null } };

export type ProjectFilterOptionsQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ProjectFilterOptionsQuery = { experienceProjects: { cursor: { hasNext: boolean, nextCursor: string | null }, projects: Array<{ projectId: string, name: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { userId: string, name: string, profileImageUrl: string | null, email: string, workspaces: Array<{ workspaceId: string }> } };

export type UserWorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserWorkspacesQuery = { me: { workspaces: Array<{ workspaceId: string }> } };

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
export const ProjectListItemFragmentDoc = new TypedDocumentString(`
    fragment ProjectListItem on ExperienceProject {
  projectId
  name
}
    `, {"fragmentName":"ProjectListItem"}) as unknown as TypedDocumentString<ProjectListItemFragment, unknown>;
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
export const SearchExperiencesDocument = new TypedDocumentString(`
    query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {
  searchExperiences(
    workspaceId: $workspaceId
    keyword: $keyword
    size: $size
    cursor: $cursor
  ) {
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
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SearchExperiencesQuery, SearchExperiencesQueryVariables>;
export const MatchedExperiencesDocument = new TypedDocumentString(`
    query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {
  experiences(
    workspaceId: $workspaceId
    jdId: $jdId
    size: $size
    cursor: $cursor
  ) {
    cursor {
      hasNext
      nextCursor
    }
    experiences {
      experienceId
      title
      tags
      matchRate
      recommendedReason: reason
      contents {
        type
        free {
          content
        }
        star {
          situation
          task
          action
          result
        }
      }
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
    `) as unknown as TypedDocumentString<MatchedExperiencesQuery, MatchedExperiencesQueryVariables>;
export const JdInsightDocument = new TypedDocumentString(`
    query JdInsight($workspaceId: ID!, $jdId: ID!) {
  jdInsight(workspaceId: $workspaceId, jdId: $jdId) {
    keyPoints
    strategy
  }
}
    `) as unknown as TypedDocumentString<JdInsightQuery, JdInsightQueryVariables>;
export const RegisterJdDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<RegisterJdMutation, RegisterJdMutationVariables>;
export const ProjectsDocument = new TypedDocumentString(`
    query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {
  projectList: experienceProjects(
    workspaceId: $workspaceId
    size: $size
    cursor: $cursor
  ) {
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
    `) as unknown as TypedDocumentString<ProjectsQuery, ProjectsQueryVariables>;
export const CreateProjectDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<CreateProjectMutation, CreateProjectMutationVariables>;
export const ProjectFilterOptionsDocument = new TypedDocumentString(`
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
    fragment ProjectListItem on ExperienceProject {
  projectId
  name
}`) as unknown as TypedDocumentString<ProjectFilterOptionsQuery, ProjectFilterOptionsQueryVariables>;
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
export const UserWorkspacesDocument = new TypedDocumentString(`
    query UserWorkspaces {
  me {
    workspaces {
      workspaceId
    }
  }
}
    `) as unknown as TypedDocumentString<UserWorkspacesQuery, UserWorkspacesQueryVariables>;
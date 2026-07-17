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

/** 수상 payload 입력입니다. */
export type ResumeAwardPayloadInput = {
  /** 수상일입니다. */
  awardedAt?: string | null | undefined;
  /** 수상명입니다. */
  name: string;
  /** 수상 기관명입니다. */
  organization?: string | null | undefined;
};

/** 기본 정보 payload 입력입니다. */
export type ResumeBasicInfoPayloadInput = {
  /** 이메일 주소입니다. */
  email?: string | null | undefined;
  /** 이름입니다. */
  name: string;
  /** 전화번호입니다. */
  phone?: string | null | undefined;
};

/** 경력 payload 입력입니다. */
export type ResumeCareerPayloadInput = {
  /** 회사명입니다. */
  companyName: string;
  /** 경력 상세 내용입니다. */
  contents: string;
  /** 재직 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 직무 또는 역할입니다. */
  role?: string | null | undefined;
};

/** 자격증 payload 입력입니다. */
export type ResumeCertificatePayloadInput = {
  /** 취득일입니다. */
  acquiredAt?: string | null | undefined;
  /** 자격증명입니다. */
  name: string;
  /** 발급 기관입니다. */
  organization?: string | null | undefined;
};

/** 핵심 역량 payload 입력입니다. */
export type ResumeCoreSkillPayloadInput = {
  /** 핵심 역량 내용입니다. */
  content: string;
};

/** 학력 payload 입력입니다. */
export type ResumeEducationPayloadInput = {
  /** 학위 또는 학력 구분입니다. */
  degree?: string | null | undefined;
  /** 전공명입니다. */
  major?: string | null | undefined;
  /** 재학 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 학교명입니다. */
  schoolName: string;
  /** 학력 상태입니다. 예: 졸업 예정 */
  status?: string | null | undefined;
};

/** 경험 payload 입력입니다. */
export type ResumeExperiencePayloadInput = {
  /** 경험 상세 내용 목록입니다. */
  contents?: string | null | undefined;
  /** 경험 이름입니다. */
  name: string;
  /** 경험 수행 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 경험에서 맡은 역할입니다. */
  role?: string | null | undefined;
};

/** 어학 payload 입력입니다. */
export type ResumeLanguagePayloadInput = {
  /** 어학 취득일입니다. */
  acquiredAt?: string | null | undefined;
  /** 어학 시험명입니다. */
  examName: string;
  /** 어학 점수 또는 등급입니다. */
  scoreOrGrade: string;
};

/** 섹션 아이템 payload 입력입니다. 정확히 하나의 필드만 채웁니다. */
export type ResumeSectionItemPayloadInput = {
  /** 수상 payload입니다. */
  award?: ResumeAwardPayloadInput | null | undefined;
  /** 기본 정보 payload입니다. */
  basicInfo?: ResumeBasicInfoPayloadInput | null | undefined;
  /** 경력 payload입니다. */
  career?: ResumeCareerPayloadInput | null | undefined;
  /** 자격증 payload입니다. */
  certificate?: ResumeCertificatePayloadInput | null | undefined;
  /** 핵심 역량 payload입니다. */
  coreSkill?: ResumeCoreSkillPayloadInput | null | undefined;
  /** 학력 payload입니다. */
  education?: ResumeEducationPayloadInput | null | undefined;
  /** 경험 payload입니다. */
  experience?: ResumeExperiencePayloadInput | null | undefined;
  /** 어학 payload입니다. */
  language?: ResumeLanguagePayloadInput | null | undefined;
  /** 기술 payload입니다. */
  skill?: ResumeSkillPayloadInput | null | undefined;
};

/** 이력서 섹션 종류입니다. */
export type ResumeSectionType =
  /** 수상 섹션입니다. */
  | 'AWARD'
  /** 기본 정보 섹션입니다. */
  | 'BASIC_INFO'
  /** 경력 섹션입니다. */
  | 'CAREER'
  /** 자격증 섹션입니다. */
  | 'CERTIFICATE'
  /** 핵심 역량 섹션입니다. */
  | 'CORE_SKILL'
  /** 학력 섹션입니다. */
  | 'EDUCATION'
  /** 경험 섹션입니다. */
  | 'EXPERIENCE'
  /** 어학 섹션입니다. */
  | 'LANGUAGE'
  /** 기술 섹션입니다. */
  | 'SKILL';

/** 기술 payload 입력입니다. */
export type ResumeSkillPayloadInput = {
  /** 숙련도 또는 수준입니다. */
  level?: string | null | undefined;
  /** 기술명입니다. */
  name: string;
};

/** 이력서 상태입니다. */
export type ResumeStatusType =
  /** 활성 이력서입니다. */
  | 'COMPLETED'
  /** 임시 저장된 이력서입니다. */
  | 'DRAFT';

/** 이력서 템플릿 종류입니다. */
export type ResumeTemplate =
  /** 기본 이력서 템플릿입니다. */
  | 'DEFAULT';

/** 이력서 생성 및 수정에 사용하는 전체 스냅샷 입력입니다. */
export type SaveResumeInput = {
  /** 저장할 섹션 목록입니다. 요청에 없는 기존 섹션은 삭제됩니다. */
  sections: Array<SaveResumeSectionInput>;
  /** 저장할 이력서 상태입니다. */
  status: ResumeStatusType;
  /** 이력서가 맞춤 대상 채용공고와 연결되는 경우의 채용공고 ID입니다. */
  targetJdId?: string | number | null | undefined;
  /** 이력서 렌더링에 사용할 템플릿입니다. */
  template: ResumeTemplate;
};

/** 이력서 섹션 저장 입력입니다. */
export type SaveResumeSectionInput = {
  /** 섹션 표시 순서입니다. */
  displayOrder: number;
  /** 섹션에 포함할 아이템 목록입니다. 요청에 없는 기존 아이템은 삭제됩니다. */
  items: Array<SaveResumeSectionItemInput>;
  /** 기존 섹션을 수정할 때 사용하는 섹션 ID입니다. 없으면 새 섹션으로 생성됩니다. */
  sectionId?: string | number | null | undefined;
  /** 섹션 타입입니다. 하위 아이템 payload 타입과 일치해야 합니다. */
  type: ResumeSectionType;
  /** 섹션 노출 여부입니다. */
  visible: boolean;
};

/** 이력서 섹션 아이템 저장 입력입니다. */
export type SaveResumeSectionItemInput = {
  /** 아이템 표시 순서입니다. */
  displayOrder: number;
  /** 기존 아이템을 수정할 때 사용하는 아이템 ID입니다. 없으면 새 아이템으로 생성됩니다. */
  itemId?: string | number | null | undefined;
  /** 섹션 타입과 일치해야 하는 payload 입력입니다. */
  payload: ResumeSectionItemPayloadInput;
  /** 아이템 노출 여부입니다. */
  visible: boolean;
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

export type CreateResumeMutationVariables = Exact<{
  workspaceId: string | number;
  input: SaveResumeInput;
}>;


export type CreateResumeMutation = { createResume: { resumeId: string } };

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
export const CreateResumeDocument = new TypedDocumentString(`
    mutation CreateResume($workspaceId: ID!, $input: SaveResumeInput!) {
  createResume(workspaceId: $workspaceId, input: $input) {
    resumeId
  }
}
    `) as unknown as TypedDocumentString<CreateResumeMutation, CreateResumeMutationVariables>;
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
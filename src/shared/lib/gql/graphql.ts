/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** Notion 연결 요청입니다. */
export type ConnectNotionRequest = {
  /** Notion OAuth authorization code입니다. */
  authorizationCode: string;
  /** Notion OAuth redirect URI입니다. */
  redirectUri: string;
};

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

/** 경험 생성 입력입니다. */
export type CreateExperienceRequest = {
  /** 경험 상세 내용입니다. */
  contents: ExperienceContentsRequest;
  /** 경험 수행 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 연결할 경험 프로젝트 ID입니다. */
  projectId: string | number;
  /** 경험에서 맡은 역할입니다. */
  role?: string | null | undefined;
  /** 경험에 부여할 태그 목록입니다. */
  tags?: Array<string> | null | undefined;
  /** 경험 제목입니다. */
  title: string;
};

/** 이력서 생성에 사용하는 전체 스냅샷 입력입니다. */
export type CreateResumeInput = {
  /** 이력서 최적화 모드입니다. JOB_SPECIFIC은 대상 채용공고를 기준으로 경험 내용을 첨삭합니다. */
  optimizationMode?: ResumeOptimizationMode;
  /** 저장할 섹션 목록입니다. 요청에 없는 기존 섹션은 삭제됩니다. */
  sections: Array<SaveResumeSectionInput>;
  /** 생성할 이력서 상태입니다. */
  status: ResumeStatusType;
  /** 이력서가 맞춤 대상 채용공고와 연결되는 경우의 채용공고 ID입니다. */
  targetJdId?: string | number | null | undefined;
  /** 이력서 렌더링에 사용할 템플릿입니다. */
  template: ResumeTemplate;
};

/** 학위입니다. */
export type Degree =
  /** 학사 */
  | 'BACHELOR'
  /** 박사 */
  | 'DOCTOR'
  /** 석사 */
  | 'MASTER';

/** 학적 상태입니다. */
export type EducationStatus =
  /** 수료 */
  | 'COMPLETED'
  /** 재학 */
  | 'ENROLLED'
  /** 졸업예정 */
  | 'EXPECTED_GRADUATION'
  /** 졸업 */
  | 'GRADUATED'
  /** 휴학 */
  | 'ON_LEAVE';

/** 경험 상세 내용 입력입니다. */
export type ExperienceContentsRequest = {
  /** FREE 형식의 상세 내용입니다. */
  free?: FreeExperienceContentsRequest | null | undefined;
  /** STAR 형식의 상세 내용입니다. */
  star?: StarExperienceContentsRequest | null | undefined;
  /** 경험 상세 내용 타입입니다. */
  type: ExperienceContentsType;
};

/** 경험 상세 내용 타입입니다. */
export type ExperienceContentsType =
  /** 자유 서술 형식입니다. */
  | 'FREE'
  /** Situation, Task, Action, Result로 구성된 형식입니다. */
  | 'STAR';

/** FREE 형식의 경험 상세 내용 입력입니다. */
export type FreeExperienceContentsRequest = {
  /** 자유 내용입니다. */
  content: string;
};

/**
 * JD 등록 입력입니다. sourceUrl 또는 body 중 하나는 필요합니다.
 * body가 있으면 크롤 없이 body로 처리하고, sourceUrl은 출처 메타로만 저장됩니다.
 */
export type JdRegisterRequest = {
  /** 붙여넣은 JD 본문입니다. (붙여넣기 등록) */
  body?: string | null | undefined;
  /** 등록할 JD 공고의 URL입니다. (크롤 등록) */
  sourceUrl?: string | null | undefined;
};

/** Notion 경험 가져오기 요청입니다. */
export type NotionExperienceImportRequest = {
  /** Notion 연결 ID입니다. */
  connectionId: string | number;
  /** 가져올 Notion 페이지 ID입니다. */
  pageId: string;
};

/** 기간 입력입니다. */
export type PeriodInput = {
  /** 기간 종료일입니다. */
  endAt?: string | null | undefined;
  /** 기간 시작일입니다. */
  startAt?: string | null | undefined;
};

/** 프로필 텍스트 AI 다듬기 입력입니다. */
export type PolishProfileTextRequest = {
  /** 직접 작성 지침입니다. 어투, 강조할 수치 등을 자유롭게 적습니다. (최대 200자) */
  instruction?: string | null | undefined;
  /** JD ID입니다. 주면 해당 JD의 지원 전략을 반영해 다듬습니다. workspaceId와 함께 사용합니다. */
  jdId?: string | number | null | undefined;
  /** 다듬기 대상 항목입니다. 항목별 글자수 제한에 맞춰 다듬습니다. */
  kind: ProfilePolishKind;
  /** 작성 구조입니다. (불렛형/문제-해결-성과/산문형, 미지정 시 원문 형식 유지) */
  structure?: PolishStructure | null | undefined;
  /** 다듬을 원문입니다. (최대 500자) */
  text: string;
  /** 경험명입니다. 경험 세부 내용을 다듬을 때 맥락으로 사용됩니다. (최대 100자) */
  title?: string | null | undefined;
};

/** 첨삭 결과의 작성 구조입니다. */
export type PolishStructure =
  /** 불렛형 */
  | 'BULLET'
  /** 문제-해결-성과 */
  | 'PROBLEM_SOLUTION_RESULT'
  /** 산문형 */
  | 'PROSE';

/** 수상 입력입니다. */
export type ProfileAwardRequest = {
  /** 수상일입니다. (YYYY-MM-DD) */
  awardedAt?: string | null | undefined;
  /** 수여 기관명입니다. */
  organization?: string | null | undefined;
  /** 수상명입니다. */
  title?: string | null | undefined;
};

/** 경력 입력입니다. */
export type ProfileCareerRequest = {
  /** 회사명입니다. */
  company?: string | null | undefined;
  /** 세부 내용입니다. (최대 500자) */
  description?: string | null | undefined;
  /** 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 직책입니다. */
  position?: string | null | undefined;
};

/** 자격증 입력입니다. */
export type ProfileCertificationRequest = {
  /** 취득일입니다. (YYYY-MM-DD) */
  acquiredAt?: string | null | undefined;
  /** 발급 기관명입니다. */
  issuer?: string | null | undefined;
  /** 자격명입니다. */
  name?: string | null | undefined;
};

/** 학력 입력입니다. */
export type ProfileEducationRequest = {
  /** 학위입니다. (학사/석사/박사) */
  degree?: Degree | null | undefined;
  /** 전공명입니다. */
  major?: string | null | undefined;
  /** 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 학교 또는 기관명입니다. */
  school?: string | null | undefined;
  /** 학적 상태입니다. (재학/휴학/졸업/졸업예정/수료) */
  status?: EducationStatus | null | undefined;
};

/** 어학 입력입니다. */
export type ProfileLanguageTestRequest = {
  /** 취득일입니다. (YYYY-MM-DD) */
  acquiredAt?: string | null | undefined;
  /** 점수 또는 등급입니다. */
  score?: string | null | undefined;
  /** 시험명입니다. */
  testName?: string | null | undefined;
};

/** 프로필 텍스트 다듬기 대상 항목입니다. */
export type ProfilePolishKind =
  /** 경력 세부 내용 (최대 500자) */
  | 'CAREER_DESCRIPTION'
  /** 핵심역량 (최대 500자) */
  | 'CORE_COMPETENCY'
  /** 경험 STAR 설명 (최대 500자) */
  | 'EXPERIENCE_DESCRIPTION'
  /** 경험명 (최대 48자) */
  | 'EXPERIENCE_TITLE';

/** 스킬 입력입니다. */
export type ProfileSkillRequest = {
  /** 숙련도입니다. (상/중/하) */
  level?: SkillLevel | null | undefined;
  /** 기술 또는 도구명입니다. */
  name?: string | null | undefined;
};

/** 수상 payload 입력입니다. */
export type ResumeAwardPayloadInput = {
  /** 수상일입니다. */
  awardedAt?: string | null | undefined;
  /** 수상명입니다. */
  name?: string | null | undefined;
  /** 수상 기관명입니다. */
  organization?: string | null | undefined;
};

/** 기본 정보 payload 입력입니다. */
export type ResumeBasicInfoPayloadInput = {
  /** 이메일 주소입니다. */
  email?: string | null | undefined;
  /** 연락처 숨김 여부입니다. */
  hideContact?: boolean;
  /** 이름입니다. */
  name?: string | null | undefined;
  /** 전화번호입니다. */
  phone?: string | null | undefined;
};

/** 경력 payload 입력입니다. */
export type ResumeCareerPayloadInput = {
  /** 회사명입니다. */
  companyName?: string | null | undefined;
  /** 경력 상세 내용입니다. */
  contents?: string | null | undefined;
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
  name?: string | null | undefined;
  /** 발급 기관입니다. */
  organization?: string | null | undefined;
};

/** 핵심 역량 payload 입력입니다. */
export type ResumeCoreSkillPayloadInput = {
  /** 핵심 역량 내용입니다. */
  content?: string | null | undefined;
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
  schoolName?: string | null | undefined;
  /** 학력 상태입니다. 예: 졸업 예정 */
  status?: string | null | undefined;
};

/** 경험 payload 입력입니다. */
export type ResumeExperiencePayloadInput = {
  /** 경험 상세 내용 목록입니다. */
  contents?: string | null | undefined;
  /** 경험 이름입니다. */
  name?: string | null | undefined;
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
  examName?: string | null | undefined;
  /** 어학 점수 또는 등급입니다. */
  scoreOrGrade?: string | null | undefined;
};

/** 이력서 저장 시 경험 내용을 처리하는 방식입니다. */
export type ResumeOptimizationMode =
  /** 대상 채용공고를 기준으로 경험 내용을 첨삭하여 저장합니다. */
  | 'JOB_SPECIFIC'
  /** 입력한 내용을 그대로 저장합니다. */
  | 'NONE';

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
  name?: string | null | undefined;
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

/** 이력서 수정에 사용하는 전체 스냅샷 입력입니다. */
export type SaveResumeInput = {
  /** 이력서 최적화 모드입니다. JOB_SPECIFIC은 대상 채용공고를 기준으로 경험 내용을 첨삭합니다. */
  optimizationMode?: ResumeOptimizationMode;
  /** 저장할 섹션 목록입니다. 요청에 없는 기존 섹션은 삭제됩니다. */
  sections: Array<SaveResumeSectionInput>;
  /** 생성할 이력서 상태입니다. */
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
  /**
   * 생성 시 섹션 타입에 맞는 기본 아이템을 만들지 여부입니다. true이면 items는 비어 있어야 합니다.
   * 수정 요청에서는 사용할 수 없습니다.
   */
  useDefaultItems?: boolean;
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

/** 스킬 숙련도입니다. */
export type SkillLevel =
  /** 상 */
  | 'HIGH'
  /** 하 */
  | 'LOW'
  /** 중 */
  | 'MEDIUM';

/** STAR 형식의 경험 상세 내용 입력입니다. */
export type StarExperienceContentsRequest = {
  /** A */
  action: string;
  /** R */
  result: string;
  /** S */
  situation: string;
  /** T */
  task: string;
};

/** 경험 프로젝트 수정 입력입니다. */
export type UpdateExperienceProjectRequest = {
  /** 변경할 경험 프로젝트 이름입니다. */
  name: string;
  /** 변경할 경험 프로젝트 진행 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 변경할 경험 프로젝트 역할입니다. */
  role?: string | null | undefined;
  /** 변경할 경험 프로젝트 요약입니다. */
  summary: string;
};

/** 경험 수정 입력입니다. */
export type UpdateExperienceRequest = {
  /** 변경할 경험 상세 내용입니다. */
  contents: ExperienceContentsRequest;
  /** 변경할 경험 수행 기간입니다. */
  period?: PeriodInput | null | undefined;
  /** 변경할 경험 프로젝트 ID입니다. */
  projectId: string | number;
  /** 변경할 경험 역할입니다. */
  role?: string | null | undefined;
  /** 변경할 태그 목록입니다. */
  tags: Array<string>;
  /** 변경할 경험 제목입니다. */
  title: string;
};

/** 프로필 수정 입력입니다. null 필드는 미변경, 섹션 리스트는 전체 교체됩니다. */
export type UpdateProfileRequest = {
  /** 변경할 수상 목록입니다. (전체 교체) */
  awards?: Array<ProfileAwardRequest> | null | undefined;
  /** 변경할 경력 목록입니다. (전체 교체) */
  careers?: Array<ProfileCareerRequest> | null | undefined;
  /** 변경할 자격증 목록입니다. (전체 교체) */
  certifications?: Array<ProfileCertificationRequest> | null | undefined;
  /** 변경할 핵심역량입니다. (최대 500자) */
  coreCompetency?: string | null | undefined;
  /** 변경할 학력 목록입니다. (전체 교체) */
  educations?: Array<ProfileEducationRequest> | null | undefined;
  /** 변경할 이메일입니다. */
  email?: string | null | undefined;
  /** 변경할 어학 목록입니다. (전체 교체) */
  languageTests?: Array<ProfileLanguageTestRequest> | null | undefined;
  /** 변경할 이름입니다. */
  name?: string | null | undefined;
  /** 변경할 전화번호입니다. (형식: 010-1234-5678, 빈 문자열 = 비우기) */
  phone?: string | null | undefined;
  /** 변경할 스킬 목록입니다. (전체 교체) */
  skills?: Array<ProfileSkillRequest> | null | undefined;
};

export type ExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, project: { projectId: string, name: string, role: string | null, period: { startAt: string | null, endAt: string | null } | null } | null }> } };

export type ProjectExperiencesQueryVariables = Exact<{
  workspaceId: string | number;
  projectId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ProjectExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, role: string | null, period: { startAt: string | null, endAt: string | null } | null }> } };

export type ExperienceQueryVariables = Exact<{
  workspaceId: string | number;
  experienceId: string | number;
}>;


export type ExperienceQuery = { experience: { experienceId: string, title: string, tags: Array<string>, role: string | null, period: { startAt: string | null, endAt: string | null } | null, contents: { type: ExperienceContentsType, star: { situation: string, task: string, action: string, result: string } | null, free: { content: string } | null } } | null };

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


export type MatchedExperiencesQuery = { experiences: { cursor: { hasNext: boolean, nextCursor: string | null }, experiences: Array<{ experienceId: string, title: string, tags: Array<string>, matchRate: number | null, recommendedReason: string | null, role: string | null, period: { startAt: string | null, endAt: string | null } | null, contents: { type: ExperienceContentsType, free: { content: string } | null, star: { situation: string, task: string, action: string, result: string } | null }, project: { projectId: string, name: string } | null }> } };

export type CreateExperienceMutationVariables = Exact<{
  workspaceId: string | number;
  request: CreateExperienceRequest;
}>;


export type CreateExperienceMutation = { createExperience: { experienceId: string } };

export type UpdateExperienceMutationVariables = Exact<{
  workspaceId: string | number;
  experienceId: string | number;
  request: UpdateExperienceRequest;
}>;


export type UpdateExperienceMutation = { updateExperience: { experienceId: string } };

export type DeleteExperienceMutationVariables = Exact<{
  workspaceId: string | number;
  experienceId: string | number;
}>;


export type DeleteExperienceMutation = { deleteExperience: boolean };

export type JdInsightQueryVariables = Exact<{
  workspaceId: string | number;
  jdId: string | number;
}>;


export type JdInsightQuery = { jdInsight: { keyPoints: string, strategy: string } | null };

export type JdMetaQueryVariables = Exact<{
  workspaceId: string | number;
  jdId: string | number;
}>;


export type JdMetaQuery = { jd: { companyName: string, positionTitle: string } | null };

export type RegisterJdMutationVariables = Exact<{
  workspaceId: string | number;
  request: JdRegisterRequest;
}>;


export type RegisterJdMutation = { registerJd: { jd: { jdId: string } | null, candidates: Array<{ title: string, body: string }> | null } };

export type ConnectNotionMutationVariables = Exact<{
  workspaceId: string | number;
  request: ConnectNotionRequest;
}>;


export type ConnectNotionMutation = { connectNotion: { connectionId: string, notionWorkspaceName: string | null, notionWorkspaceIcon: string | null } };

export type NotionConnectionsQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
}>;


export type NotionConnectionsQuery = { notionConnections: { connections: Array<{ connectionId: string, notionWorkspaceName: string | null, notionWorkspaceIcon: string | null }>, cursor: { hasNext: boolean, nextCursor: string | null } } };

export type NotionPagesQueryVariables = Exact<{
  workspaceId: string | number;
  connectionId: string | number;
  query?: string | null | undefined;
  size: number;
  cursor?: string | null | undefined;
}>;


export type NotionPagesQuery = { notionPages: { pages: Array<{ pageId: string, title: string, url: string | null, lastEditedTime: string | null }>, cursor: { hasNext: boolean, nextCursor: string | null } } };

export type ImportNotionExperiencesMutationVariables = Exact<{
  workspaceId: string | number;
  request: NotionExperienceImportRequest;
}>;


export type ImportNotionExperiencesMutation = { importNotionExperiences: boolean };

export type ProfileQueryVariables = Exact<{
  workspaceId: string | number;
}>;


export type ProfileQuery = { profile: { profileId: string, name: string | null, email: string | null, phone: string | null, educations: Array<{ school: string | null, major: string | null, degree: Degree | null, status: EducationStatus | null, period: { startAt: string | null, endAt: string | null } | null }>, careers: Array<{ company: string | null, position: string | null, period: { startAt: string | null, endAt: string | null } | null }>, awards: Array<{ title: string | null, organization: string | null, awardedAt: string | null }>, languageTests: Array<{ testName: string | null, score: string | null, acquiredAt: string | null }>, certifications: Array<{ name: string | null, issuer: string | null, acquiredAt: string | null }>, skills: Array<{ name: string | null, level: SkillLevel | null }> } };

export type UpdateProfileMutationVariables = Exact<{
  workspaceId: string | number;
  request: UpdateProfileRequest;
}>;


export type UpdateProfileMutation = { updateProfile: { profileId: string } };

export type PolishProfileTextMutationVariables = Exact<{
  request: PolishProfileTextRequest;
  workspaceId?: string | number | null | undefined;
}>;


export type PolishProfileTextMutation = { polishProfileText: string };

export type ProjectListItemFragment = { projectId: string, name: string };

export type ProjectsQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
}>;


export type ProjectsQuery = { projectList: { cursor: { hasNext: boolean, nextCursor: string | null }, projects: Array<{ projectId: string, name: string, period: { startAt: string | null, endAt: string | null } | null }> } };

export type ProjectQueryVariables = Exact<{
  workspaceId: string | number;
  projectId: string | number;
}>;


export type ProjectQuery = { project: { projectId: string, name: string, role: string | null, summary: string, period: { startAt: string | null, endAt: string | null } | null } };

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

export type UpdateProjectMutationVariables = Exact<{
  workspaceId: string | number;
  projectId: string | number;
  request: UpdateExperienceProjectRequest;
}>;


export type UpdateProjectMutation = { updateProject: { projectId: string, name: string, role: string | null, summary: string, period: { startAt: string | null, endAt: string | null } | null } };

export type DeleteProjectMutationVariables = Exact<{
  workspaceId: string | number;
  projectId: string | number;
}>;


export type DeleteProjectMutation = { deleteExperienceProject: boolean };

export type ResumesQueryVariables = Exact<{
  workspaceId: string | number;
  size: number;
  cursor?: string | null | undefined;
  statuses?: Array<ResumeStatusType> | ResumeStatusType | null | undefined;
}>;


export type ResumesQuery = { resumes: { cursor: { hasNext: boolean, nextCursor: string | null }, resumes: Array<{ resumeId: string, status: ResumeStatusType, createdAt: string, targetJd: { jdId: string, companyName: string, positionTitle: string, coreCompetencies: Array<string> } | null }> } };

export type ResumeCountsQueryVariables = Exact<{
  workspaceId: string | number;
}>;


export type ResumeCountsQuery = { resumeCounts: Array<{ status: ResumeStatusType, count: unknown }> };

export type CreateResumeMutationVariables = Exact<{
  workspaceId: string | number;
  input: CreateResumeInput;
}>;


export type CreateResumeMutation = { createResume: { resumeId: string } };

export type UpdateResumeMutationVariables = Exact<{
  workspaceId: string | number;
  resumeId: string | number;
  input: SaveResumeInput;
}>;


export type UpdateResumeMutation = { updateResume: { resumeId: string } };

export type ResumeBasicInfoFieldsFragment = { name: string | null, email: string | null, phone: string | null, hideContact: boolean };

export type ResumeCoreSkillFieldsFragment = { content: string | null };

export type ResumeCareerFieldsFragment = { companyName: string | null, role: string | null, contents: string | null, period: { startAt: string | null, endAt: string | null } | null };

export type ResumeExperienceFieldsFragment = { name: string | null, role: string | null, contents: string | null, period: { startAt: string | null, endAt: string | null } | null };

export type ResumeEducationFieldsFragment = { schoolName: string | null, major: string | null, degree: string | null, status: string | null, period: { startAt: string | null, endAt: string | null } | null };

export type ResumeAwardFieldsFragment = { name: string | null, organization: string | null, awardedAt: string | null };

export type ResumeLanguageFieldsFragment = { examName: string | null, scoreOrGrade: string | null, acquiredAt: string | null };

export type ResumeCertificateFieldsFragment = { name: string | null, organization: string | null, acquiredAt: string | null };

export type ResumeSkillFieldsFragment = { name: string | null, level: string | null };

export type ResumeQueryVariables = Exact<{
  resumeId: string | number;
  workspaceId: string | number;
}>;


export type ResumeQuery = { resume: { resumeId: string, status: ResumeStatusType, template: ResumeTemplate, targetJd: { jdId: string, companyName: string, positionTitle: string } | null, sections: Array<{ sectionId: string, type: ResumeSectionType, displayText: string, displayOrder: number, visible: boolean, items: Array<{ itemId: string, displayOrder: number, visible: boolean, payload: { basicInfo: { name: string | null, email: string | null, phone: string | null, hideContact: boolean } | null, coreSkill: { content: string | null } | null, career: { companyName: string | null, role: string | null, contents: string | null, period: { startAt: string | null, endAt: string | null } | null } | null, experience: { name: string | null, role: string | null, contents: string | null, period: { startAt: string | null, endAt: string | null } | null } | null, education: { schoolName: string | null, major: string | null, degree: string | null, status: string | null, period: { startAt: string | null, endAt: string | null } | null } | null, award: { name: string | null, organization: string | null, awardedAt: string | null } | null, language: { examName: string | null, scoreOrGrade: string | null, acquiredAt: string | null } | null, certificate: { name: string | null, organization: string | null, acquiredAt: string | null } | null, skill: { name: string | null, level: string | null } | null } }> }> } };

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
export const ResumeBasicInfoFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {
  name
  email
  phone
  hideContact
}
    `, {"fragmentName":"ResumeBasicInfoFields"}) as unknown as TypedDocumentString<ResumeBasicInfoFieldsFragment, unknown>;
export const ResumeCoreSkillFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {
  content
}
    `, {"fragmentName":"ResumeCoreSkillFields"}) as unknown as TypedDocumentString<ResumeCoreSkillFieldsFragment, unknown>;
export const ResumeCareerFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeCareerFields on ResumeCareerPayload {
  companyName
  role
  contents
  period {
    startAt
    endAt
  }
}
    `, {"fragmentName":"ResumeCareerFields"}) as unknown as TypedDocumentString<ResumeCareerFieldsFragment, unknown>;
export const ResumeExperienceFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeExperienceFields on ResumeExperiencePayload {
  name
  role
  contents
  period {
    startAt
    endAt
  }
}
    `, {"fragmentName":"ResumeExperienceFields"}) as unknown as TypedDocumentString<ResumeExperienceFieldsFragment, unknown>;
export const ResumeEducationFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeEducationFields on ResumeEducationPayload {
  schoolName
  major
  degree
  status
  period {
    startAt
    endAt
  }
}
    `, {"fragmentName":"ResumeEducationFields"}) as unknown as TypedDocumentString<ResumeEducationFieldsFragment, unknown>;
export const ResumeAwardFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeAwardFields on ResumeAwardPayload {
  name
  organization
  awardedAt
}
    `, {"fragmentName":"ResumeAwardFields"}) as unknown as TypedDocumentString<ResumeAwardFieldsFragment, unknown>;
export const ResumeLanguageFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeLanguageFields on ResumeLanguagePayload {
  examName
  scoreOrGrade
  acquiredAt
}
    `, {"fragmentName":"ResumeLanguageFields"}) as unknown as TypedDocumentString<ResumeLanguageFieldsFragment, unknown>;
export const ResumeCertificateFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeCertificateFields on ResumeCertificatePayload {
  name
  organization
  acquiredAt
}
    `, {"fragmentName":"ResumeCertificateFields"}) as unknown as TypedDocumentString<ResumeCertificateFieldsFragment, unknown>;
export const ResumeSkillFieldsFragmentDoc = new TypedDocumentString(`
    fragment ResumeSkillFields on ResumeSkillPayload {
  name
  level
}
    `, {"fragmentName":"ResumeSkillFields"}) as unknown as TypedDocumentString<ResumeSkillFieldsFragment, unknown>;
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
export const ProjectExperiencesDocument = new TypedDocumentString(`
    query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String) {
  experiences(
    workspaceId: $workspaceId
    projectId: $projectId
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
      role
      period {
        startAt
        endAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ProjectExperiencesQuery, ProjectExperiencesQueryVariables>;
export const ExperienceDocument = new TypedDocumentString(`
    query Experience($workspaceId: ID!, $experienceId: ID!) {
  experience(workspaceId: $workspaceId, experienceId: $experienceId) {
    experienceId
    title
    tags
    role
    period {
      startAt
      endAt
    }
    contents {
      type
      star {
        situation
        task
        action
        result
      }
      free {
        content
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ExperienceQuery, ExperienceQueryVariables>;
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
      recommendedReason
      role
      period {
        startAt
        endAt
      }
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
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MatchedExperiencesQuery, MatchedExperiencesQueryVariables>;
export const CreateExperienceDocument = new TypedDocumentString(`
    mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {
  createExperience(workspaceId: $workspaceId, request: $request) {
    experienceId
  }
}
    `) as unknown as TypedDocumentString<CreateExperienceMutation, CreateExperienceMutationVariables>;
export const UpdateExperienceDocument = new TypedDocumentString(`
    mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {
  updateExperience(
    workspaceId: $workspaceId
    experienceId: $experienceId
    request: $request
  ) {
    experienceId
  }
}
    `) as unknown as TypedDocumentString<UpdateExperienceMutation, UpdateExperienceMutationVariables>;
export const DeleteExperienceDocument = new TypedDocumentString(`
    mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {
  deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)
}
    `) as unknown as TypedDocumentString<DeleteExperienceMutation, DeleteExperienceMutationVariables>;
export const JdInsightDocument = new TypedDocumentString(`
    query JdInsight($workspaceId: ID!, $jdId: ID!) {
  jdInsight(workspaceId: $workspaceId, jdId: $jdId) {
    keyPoints
    strategy
  }
}
    `) as unknown as TypedDocumentString<JdInsightQuery, JdInsightQueryVariables>;
export const JdMetaDocument = new TypedDocumentString(`
    query JdMeta($workspaceId: ID!, $jdId: ID!) {
  jd(workspaceId: $workspaceId, id: $jdId) {
    companyName
    positionTitle
  }
}
    `) as unknown as TypedDocumentString<JdMetaQuery, JdMetaQueryVariables>;
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
export const ConnectNotionDocument = new TypedDocumentString(`
    mutation ConnectNotion($workspaceId: ID!, $request: ConnectNotionRequest!) {
  connectNotion(workspaceId: $workspaceId, request: $request) {
    connectionId
    notionWorkspaceName
    notionWorkspaceIcon
  }
}
    `) as unknown as TypedDocumentString<ConnectNotionMutation, ConnectNotionMutationVariables>;
export const NotionConnectionsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<NotionConnectionsQuery, NotionConnectionsQueryVariables>;
export const NotionPagesDocument = new TypedDocumentString(`
    query NotionPages($workspaceId: ID!, $connectionId: ID!, $query: String, $size: Int!, $cursor: String) {
  notionPages(
    workspaceId: $workspaceId
    connectionId: $connectionId
    query: $query
    size: $size
    cursor: $cursor
  ) {
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
    `) as unknown as TypedDocumentString<NotionPagesQuery, NotionPagesQueryVariables>;
export const ImportNotionExperiencesDocument = new TypedDocumentString(`
    mutation ImportNotionExperiences($workspaceId: ID!, $request: NotionExperienceImportRequest!) {
  importNotionExperiences(workspaceId: $workspaceId, request: $request)
}
    `) as unknown as TypedDocumentString<ImportNotionExperiencesMutation, ImportNotionExperiencesMutationVariables>;
export const ProfileDocument = new TypedDocumentString(`
    query Profile($workspaceId: ID!) {
  profile(workspaceId: $workspaceId) {
    profileId
    name
    email
    phone
    educations {
      school
      major
      degree
      status
      period {
        startAt
        endAt
      }
    }
    careers {
      company
      position
      period {
        startAt
        endAt
      }
    }
    awards {
      title
      organization
      awardedAt
    }
    languageTests {
      testName
      score
      acquiredAt
    }
    certifications {
      name
      issuer
      acquiredAt
    }
    skills {
      name
      level
    }
  }
}
    `) as unknown as TypedDocumentString<ProfileQuery, ProfileQueryVariables>;
export const UpdateProfileDocument = new TypedDocumentString(`
    mutation UpdateProfile($workspaceId: ID!, $request: UpdateProfileRequest!) {
  updateProfile(workspaceId: $workspaceId, request: $request) {
    profileId
  }
}
    `) as unknown as TypedDocumentString<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const PolishProfileTextDocument = new TypedDocumentString(`
    mutation PolishProfileText($request: PolishProfileTextRequest!, $workspaceId: ID) {
  polishProfileText(request: $request, workspaceId: $workspaceId)
}
    `) as unknown as TypedDocumentString<PolishProfileTextMutation, PolishProfileTextMutationVariables>;
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
export const ProjectDocument = new TypedDocumentString(`
    query Project($workspaceId: ID!, $projectId: ID!) {
  project: experienceProject(workspaceId: $workspaceId, projectId: $projectId) {
    projectId
    name
    role
    summary
    period {
      startAt
      endAt
    }
  }
}
    `) as unknown as TypedDocumentString<ProjectQuery, ProjectQueryVariables>;
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
export const UpdateProjectDocument = new TypedDocumentString(`
    mutation UpdateProject($workspaceId: ID!, $projectId: ID!, $request: UpdateExperienceProjectRequest!) {
  updateProject: updateExperienceProject(
    workspaceId: $workspaceId
    projectId: $projectId
    request: $request
  ) {
    projectId
    name
    role
    summary
    period {
      startAt
      endAt
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = new TypedDocumentString(`
    mutation DeleteProject($workspaceId: ID!, $projectId: ID!) {
  deleteExperienceProject(workspaceId: $workspaceId, projectId: $projectId)
}
    `) as unknown as TypedDocumentString<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const ResumesDocument = new TypedDocumentString(`
    query Resumes($workspaceId: ID!, $size: Int!, $cursor: String, $statuses: [ResumeStatusType!]) {
  resumes(
    workspaceId: $workspaceId
    size: $size
    cursor: $cursor
    statuses: $statuses
  ) {
    cursor {
      hasNext
      nextCursor
    }
    resumes {
      resumeId
      status
      createdAt
      targetJd {
        jdId
        companyName
        positionTitle
        coreCompetencies
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ResumesQuery, ResumesQueryVariables>;
export const ResumeCountsDocument = new TypedDocumentString(`
    query ResumeCounts($workspaceId: ID!) {
  resumeCounts(workspaceId: $workspaceId) {
    status
    count
  }
}
    `) as unknown as TypedDocumentString<ResumeCountsQuery, ResumeCountsQueryVariables>;
export const CreateResumeDocument = new TypedDocumentString(`
    mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {
  createResume(workspaceId: $workspaceId, input: $input) {
    resumeId
  }
}
    `) as unknown as TypedDocumentString<CreateResumeMutation, CreateResumeMutationVariables>;
export const UpdateResumeDocument = new TypedDocumentString(`
    mutation UpdateResume($workspaceId: ID!, $resumeId: ID!, $input: SaveResumeInput!) {
  updateResume(workspaceId: $workspaceId, resumeId: $resumeId, input: $input) {
    resumeId
  }
}
    `) as unknown as TypedDocumentString<UpdateResumeMutation, UpdateResumeMutationVariables>;
export const ResumeDocument = new TypedDocumentString(`
    query Resume($resumeId: ID!, $workspaceId: ID!) {
  resume(resumeId: $resumeId, workspaceId: $workspaceId) {
    resumeId
    status
    template
    targetJd {
      jdId
      companyName
      positionTitle
    }
    sections {
      sectionId
      type
      displayText
      displayOrder
      visible
      items {
        itemId
        displayOrder
        visible
        payload {
          basicInfo {
            ...ResumeBasicInfoFields
          }
          coreSkill {
            ...ResumeCoreSkillFields
          }
          career {
            ...ResumeCareerFields
          }
          experience {
            ...ResumeExperienceFields
          }
          education {
            ...ResumeEducationFields
          }
          award {
            ...ResumeAwardFields
          }
          language {
            ...ResumeLanguageFields
          }
          certificate {
            ...ResumeCertificateFields
          }
          skill {
            ...ResumeSkillFields
          }
        }
      }
    }
  }
}
    fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {
  name
  email
  phone
  hideContact
}
fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {
  content
}
fragment ResumeCareerFields on ResumeCareerPayload {
  companyName
  role
  contents
  period {
    startAt
    endAt
  }
}
fragment ResumeExperienceFields on ResumeExperiencePayload {
  name
  role
  contents
  period {
    startAt
    endAt
  }
}
fragment ResumeEducationFields on ResumeEducationPayload {
  schoolName
  major
  degree
  status
  period {
    startAt
    endAt
  }
}
fragment ResumeAwardFields on ResumeAwardPayload {
  name
  organization
  awardedAt
}
fragment ResumeLanguageFields on ResumeLanguagePayload {
  examName
  scoreOrGrade
  acquiredAt
}
fragment ResumeCertificateFields on ResumeCertificatePayload {
  name
  organization
  acquiredAt
}
fragment ResumeSkillFields on ResumeSkillPayload {
  name
  level
}`) as unknown as TypedDocumentString<ResumeQuery, ResumeQueryVariables>;
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
import type { ExperienceQuery, ProjectExperiencesQuery } from '@shared/lib/gql/graphql'

/** 경험 단건 상세(제목·태그·역할·기간·STAR 포함). `Experience` 쿼리 결과에서 파생. */
export type ExperienceDetail = NonNullable<ExperienceQuery['experience']>

/** 프로젝트 경험 목록의 단일 경험(제목·태그·역할·기간). `ProjectExperiences` 쿼리 결과에서 파생. */
export type ProjectExperience = ProjectExperiencesQuery['experiences']['experiences'][number]

/** STAR 형식 경험 상세 내용 (Situation·Task·Action·Result) */
export interface StarContentsInput {
  situation: string
  task: string
  action: string
  result: string
}

/** 경험 상세 내용 입력. STAR 또는 FREE 형식 중 하나를 채운다. */
export interface ExperienceContentsInput {
  type: 'STAR' | 'FREE'
  star?: StarContentsInput | null
  free?: { content: string } | null
}

/** 경험 수행 기간 입력. 값이 없으면 각 필드는 `null`. 저장 형식은 `"YYYY-MM-DD"`(또는 `"YYYY-MM"`) 대시 ISO. */
export interface PeriodInput {
  startAt: string | null
  endAt: string | null
}

export interface CreateExperienceInput {
  projectId: string
  title: string
  tags?: string[]
  contents: ExperienceContentsInput
  role?: string | null
  period?: PeriodInput | null
}

/**
 * 경험 수정 입력. 백엔드가 전체 스냅샷을 요구하므로(모든 필드 필수) 부분 수정이 아닌
 * 현재 값 전체를 담아 보낸다. `role`/`period`는 미설정 시 `null`.
 */
export interface UpdateExperienceInput {
  projectId: string
  title: string
  tags: string[]
  contents: ExperienceContentsInput
  role?: string | null
  period?: PeriodInput | null
}

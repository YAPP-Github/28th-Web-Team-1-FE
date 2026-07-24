export type ResumeSectionType = 'basic' | 'education' | 'career' | 'award' | 'language' | 'certificate' | 'skill'

/** 편집 폼은 4열 그리드다. 필드 하나가 차지하는 칸 수(1=1/4, 2=1/2, 3=3/4, 4=한 행 전체). 미지정 시 4(전체 폭). */
export type ResumeFieldSpan = 1 | 2 | 3 | 4

export interface ResumeField {
  key: string
  label: string
  placeholder: string
  /** 이 필드가 차지하는 폭. 같은 행에 놓이려면 인접 필드들의 span 합이 4 이하여야 한다. */
  span?: ResumeFieldSpan
  /** 값 입력 방식. 미지정(기본)이면 텍스트 `Input`, `'date'`면 `DatePicker`, `'period'`면 `MonthPicker` 두 개(시작~종료), `'select'`면 드롭다운으로 렌더링한다. */
  kind?: 'date' | 'period' | 'select'
  /** `kind: 'select'`일 때의 선택지. */
  options?: readonly string[]
}

interface ResumeSectionConfig {
  type: ResumeSectionType
  title: string
  fields: ResumeField[]
  /** 항상 존재하며 삭제/추가 대상이 아닌 섹션(기본 정보). */
  fixed?: boolean
}

const input = (key: string, label: string, opts?: { placeholder?: string; span?: ResumeFieldSpan }): ResumeField => ({
  key,
  label,
  // 디자인 문구를 그대로 따른다("{label}를 입력해 주세요.").
  placeholder: opts?.placeholder ?? `${label}를 입력해 주세요.`,
  span: opts?.span
})

/** `DatePicker`(연·월·일)로 렌더링되는 필드. 값은 `formatPeriod`/`sectionsToUpdateRequest`와 맞춰 `YYYY-MM-DD`로 저장한다. */
const dateInput = (key: string, label: string, opts?: { span?: ResumeFieldSpan }): ResumeField => ({ key, label, placeholder: 'YYYY.MM.DD', span: opts?.span ?? 2, kind: 'date' })

/** `MonthPicker` 두 개(시작~종료)로 렌더링되는 기간 필드. 값은 `formatPeriod`/`parsePeriodInput`과 맞춰 `"YYYY.MM - YYYY.MM"`로 저장한다. */
const periodInput = (key: string, label: string, opts?: { span?: ResumeFieldSpan }): ResumeField => ({ key, label, placeholder: 'YYYY.MM - YYYY.MM', span: opts?.span ?? 2, kind: 'period' })

/** 드롭다운으로 렌더링되는 선택 필드. */
const selectInput = (key: string, label: string, opts: { options: readonly string[]; span?: ResumeFieldSpan }): ResumeField => ({
  key,
  label,
  placeholder: `${label} 선택`,
  span: opts.span,
  kind: 'select',
  options: opts.options
})

/** 기술 숙련도 드롭다운 선택지(한글 라벨). */
export const SKILL_LEVELS = ['상', '중', '하'] as const

/** 학력 학위 드롭다운 선택지(한글 라벨). `profileMapping`의 `DEGREE` 맵과 같은 라벨을 쓴다. */
export const DEGREE_LEVELS = ['학사', '석사', '박사'] as const

/** 학력 상태 드롭다운 선택지(한글 라벨). `profileMapping`의 `STATUS` 맵과 같은 라벨을 쓴다. */
export const EDUCATION_STATUSES = ['재학', '휴학', '졸업', '졸업예정', '수료'] as const

/**
 * 이력서 섹션 타입별 구성(제목 + 필드 스키마).
 * 카드 표시와 편집 모달이 모두 이 스키마를 데이터 소스로 사용한다.
 */
export const RESUME_SECTIONS: Record<ResumeSectionType, ResumeSectionConfig> = {
  basic: {
    type: 'basic',
    title: '기본 정보',
    fixed: true,
    fields: [input('name', '이름'), input('phone', '연락처', { placeholder: '010-1234-5678', span: 2 }), input('email', '이메일', { placeholder: 'ID@gmail.com', span: 2 })]
  },
  education: {
    type: 'education',
    title: '학력',
    fields: [
      input('school', '학교', { placeholder: '학교명을 입력해주세요.' }),
      selectInput('status', '상태', { options: EDUCATION_STATUSES, span: 2 }),
      periodInput('period', '기간'),
      input('major', '전공', { placeholder: '전공명', span: 2 }),
      selectInput('degree', '학위', { options: DEGREE_LEVELS, span: 2 })
    ]
  },
  career: {
    type: 'career',
    title: '경력',
    fields: [input('company', '회사명'), input('position', '직책', { placeholder: '직책을 입력해주세요.', span: 2 }), periodInput('period', '기간')]
  },
  award: {
    type: 'award',
    title: '수상',
    fields: [input('title', '수상명'), input('organization', '기관', { placeholder: '기관명', span: 2 }), dateInput('awardedAt', '수상일')]
  },
  language: {
    type: 'language',
    title: '어학',
    fields: [input('testName', '시험명'), input('score', '점수/등급', { placeholder: '점수 또는 등급', span: 2 }), dateInput('acquiredAt', '취득일')]
  },
  certificate: {
    type: 'certificate',
    title: '자격증',
    fields: [input('name', '자격증명'), input('issuer', '발급기관', { placeholder: '발급기관명', span: 2 }), dateInput('acquiredAt', '취득일')]
  },
  skill: {
    type: 'skill',
    title: '기술',
    fields: [input('name', '기술/도구명', { span: 3 }), selectInput('level', '숙련도', { options: SKILL_LEVELS, span: 1 })]
  }
}

/** 초기 카드 구성(추출 결과 템플릿): 모든 섹션을 하나씩 노출한다. */
export const INITIAL_SECTION_TYPES: ResumeSectionType[] = ['basic', 'education', 'career', 'award', 'language', 'certificate', 'skill']

/** "항목 추가하기"로 추가할 수 있는 섹션 타입(기본 정보 제외). */
export const ADDABLE_SECTION_TYPES: ResumeSectionType[] = ['education', 'career', 'award', 'language', 'certificate', 'skill']

/** 화면에 놓인 카드 한 장(섹션 인스턴스). 같은 타입을 여러 개 가질 수 있다. */
export interface ResumeSectionInstance {
  id: string
  type: ResumeSectionType
  values: Record<string, string>
}

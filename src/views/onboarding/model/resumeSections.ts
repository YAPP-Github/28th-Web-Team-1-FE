export type ResumeSectionType = 'basic' | 'education' | 'career' | 'award' | 'language' | 'certificate' | 'skill'

export interface ResumeField {
  key: string
  label: string
  placeholder: string
  /** true인 필드는 인접한 half 필드와 한 행(2열)으로 묶인다. */
  half?: boolean
}

export interface ResumeSectionConfig {
  type: ResumeSectionType
  title: string
  fields: ResumeField[]
  /** 항상 존재하며 삭제/추가 대상이 아닌 섹션(기본 정보). */
  fixed?: boolean
}

const input = (key: string, label: string, opts?: { placeholder?: string; half?: boolean }): ResumeField => ({
  key,
  label,
  // 디자인 문구를 그대로 따른다("{label}를 입력해 주세요.").
  placeholder: opts?.placeholder ?? `${label}를 입력해 주세요.`,
  half: opts?.half
})

/**
 * 이력서 섹션 타입별 구성(제목 + 필드 스키마).
 * 카드 표시와 편집 모달이 모두 이 스키마를 데이터 소스로 사용한다.
 */
export const RESUME_SECTIONS: Record<ResumeSectionType, ResumeSectionConfig> = {
  basic: {
    type: 'basic',
    title: '기본 정보',
    fixed: true,
    fields: [input('name', '이름'), input('phone', '연락처', { placeholder: '010-1234-5678', half: true }), input('email', '이메일', { placeholder: 'ID@gmail.com', half: true })]
  },
  education: {
    type: 'education',
    title: '학력',
    fields: [input('school', '학교'), input('major', '전공'), input('degree', '학위'), input('status', '상태'), input('period', '기간')]
  },
  career: {
    type: 'career',
    title: '경력',
    fields: [input('company', '회사명'), input('position', '직책'), input('period', '기간')]
  },
  award: {
    type: 'award',
    title: '수상',
    fields: [input('title', '수상명'), input('organization', '기관'), input('awardedAt', '수상일')]
  },
  language: {
    type: 'language',
    title: '어학',
    fields: [input('testName', '시험명'), input('score', '점수/등급'), input('acquiredAt', '취득일')]
  },
  certificate: {
    type: 'certificate',
    title: '자격증',
    fields: [input('name', '자격증명'), input('issuer', '발급기관'), input('acquiredAt', '취득일')]
  },
  skill: {
    type: 'skill',
    title: '기술',
    fields: [input('name', '기술명 또는 도구명'), input('level', '상/중/하')]
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

import type { ResumeSectionType } from '@shared/lib/gql/graphql'
import { nextDisplayOrder, type ResumeFormSection } from './resume-form.types'

/**
 * 섹션 타입 → 카테고리 표시명. 신규 섹션의 `displayText` 기본값으로도 쓴다.
 * (서버가 저장 후 타입 기준으로 다시 부여하므로 임시 라벨 역할)
 */
export const SECTION_CATEGORY_LABELS: Record<ResumeSectionType, string> = {
  BASIC_INFO: '기본정보',
  CORE_SKILL: '핵심역량',
  EXPERIENCE: '경험',
  CAREER: '경력',
  EDUCATION: '학력',
  AWARD: '수상',
  CERTIFICATE: '자격증',
  LANGUAGE: '어학',
  SKILL: '기술'
}

/** 모달에서 추가/삭제할 수 있는 본문 카테고리(기본정보 제외) 표시 순서. */
export const ADDABLE_CATEGORY_TYPES: ResumeSectionType[] = ['CORE_SKILL', 'EXPERIENCE', 'CAREER', 'EDUCATION', 'AWARD', 'CERTIFICATE', 'LANGUAGE', 'SKILL']

/**
 * 새 카테고리 섹션(아이템 없음)을 만든다. `sectionId`가 `null`(신규)이라 저장 시 서버가 생성하고,
 * `displayOrder`는 저장 시 배열 index로 정규화되므로 여기 값은 임시다.
 */
export const createCategorySection = (type: ResumeSectionType, siblings: ResumeFormSection[]): ResumeFormSection => ({
  uid: crypto.randomUUID(),
  sectionId: null,
  type,
  displayText: SECTION_CATEGORY_LABELS[type],
  displayOrder: nextDisplayOrder(siblings),
  visible: true,
  items: []
})

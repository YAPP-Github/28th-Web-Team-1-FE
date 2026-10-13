import type { ResumeQuery } from '@shared/lib/gql/graphql'
import { createCategorySection } from './category'
import { createFormItem, type ResumeFormSection, type ResumeFormValues } from './resume-form.types'

/**
 * 서버 이력서 상세(`resume`)를 폼 초기값(`defaultValues`)으로 변환한다.
 *
 * 저장 시 요청에 없는 섹션·아이템은 서버가 삭제하므로, **노출 여부와 무관하게 모든 섹션·아이템을
 * 그대로 담아야 한다. (미리보기·목차의 visible 필터는 표시 단계에서만 적용)
 * payload는 응답=입력 형태가 같아 그대로 전달한다.
 */
const byDisplayOrder = <T extends { displayOrder: number }>(a: T, b: T) => a.displayOrder - b.displayOrder

/**
 * 편집 진입 시 경험(EXPERIENCE) 섹션이 없으면 빈 섹션을 자동으로 넣는다.
 * (import 등 서버가 경험을 추출하지 못해 섹션을 만들지 않은 이력서에서 경험을 편집할 수 있게 한다.)
 */
const withExperienceSection = (sections: ResumeFormSection[]): ResumeFormSection[] => {
  if (sections.some((section) => section.type === 'EXPERIENCE')) return sections

  const experienceSection: ResumeFormSection = {
    ...createCategorySection('EXPERIENCE', sections),
    items: [createFormItem({ experience: { name: '', role: null, contents: '', period: null, experienceQuestionRoomId: null } }, 1)]
  }

  // 생성 시 섹션 순서(`buildResumeInput`)와 맞춰 CORE_SKILL 바로 뒤에 둔다. 없으면 맨 뒤에 붙인다.
  const coreSkillIndex = sections.findIndex((section) => section.type === 'CORE_SKILL')
  if (coreSkillIndex < 0) return [...sections, experienceSection]
  return [...sections.slice(0, coreSkillIndex + 1), experienceSection, ...sections.slice(coreSkillIndex + 1)]
}

/**
 * 편집 진입 시 핵심역량(CORE_SKILL) 섹션이 없으면 빈 아이템을 주입한다.
 * `isInitialItem: true`로 두면 편집 화면이 진입 시 AI 핵심역량을 자동 생성해 채운다(`needsCoreCompetency`).
 * 생성 시 섹션 순서(`buildResumeInput`)와 맞춰 기본정보 바로 뒤에 둔다.
 */
const withCoreSkillSection = (sections: ResumeFormSection[]): ResumeFormSection[] => {
  if (sections.some((section) => section.type === 'CORE_SKILL')) return sections

  const coreSkillSection: ResumeFormSection = {
    ...createCategorySection('CORE_SKILL', sections),
    items: [createFormItem({ coreSkill: { content: '', isInitialItem: true } }, 1)]
  }

  const basicInfoIndex = sections.findIndex((section) => section.type === 'BASIC_INFO')
  if (basicInfoIndex < 0) return [coreSkillSection, ...sections]
  return [...sections.slice(0, basicInfoIndex + 1), coreSkillSection, ...sections.slice(basicInfoIndex + 1)]
}

export const resumeToFormValues = (resume: ResumeQuery['resume']): ResumeFormValues => {
  // 로드 시점에 한 번만 displayOrder로 정렬한다. 이후로는 폼 배열 순서가 곧 표시 순서다.
  const sections = [...resume.sections].sort(byDisplayOrder).map((section) => ({
    uid: section.sectionId,
    sectionId: section.sectionId,
    type: section.type,
    displayText: section.displayText,
    displayOrder: section.displayOrder,
    visible: section.visible,
    items: [...section.items].sort(byDisplayOrder).map((item) => ({
      uid: item.itemId,
      itemId: item.itemId,
      displayOrder: item.displayOrder,
      visible: item.visible,
      payload: item.payload
    }))
  }))

  return { sections: withExperienceSection(withCoreSkillSection(sections)) }
}

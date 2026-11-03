import type { ResumeQuery, ResumeSectionType } from '@shared/lib/gql/graphql'
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

/** `afterType` 섹션 바로 뒤에 `section`을 끼운다. 기준 섹션이 없으면 맨 뒤에 붙인다. 생성 시 섹션 순서와 맞춘다. */
const insertAfterType = (sections: ResumeFormSection[], afterType: ResumeSectionType, section: ResumeFormSection): ResumeFormSection[] => {
  const index = sections.findIndex((s) => s.type === afterType)
  return index < 0 ? [...sections, section] : [...sections.slice(0, index + 1), section, ...sections.slice(index + 1)]
}

/** 편집 진입 시 경험(EXPERIENCE) 섹션이 없으면 아이템 없는 섹션을 폼에만 넣는다. `autoInjected`로 표시해 저장 때 구분한다. */
const withExperienceSection = (sections: ResumeFormSection[]): ResumeFormSection[] =>
  sections.some((s) => s.type === 'EXPERIENCE') ? sections : insertAfterType(sections, 'CORE_SKILL', { ...createCategorySection('EXPERIENCE', sections), autoInjected: true })

/**
 * 편집 진입 시 핵심역량(CORE_SKILL) 섹션이 없으면 빈 아이템을 주입한다.
 * `isInitialItem: true`로 두면 편집 화면이 진입 시 AI 핵심역량을 자동 생성해 채운다(`needsCoreCompetency`).
 */
const withCoreSkillSection = (sections: ResumeFormSection[]): ResumeFormSection[] => {
  if (sections.some((s) => s.type === 'CORE_SKILL')) return sections

  const coreSkillSection: ResumeFormSection = {
    ...createCategorySection('CORE_SKILL', sections),
    items: [createFormItem({ coreSkill: { content: '', isInitialItem: true } }, 1)]
  }
  return insertAfterType(sections, 'BASIC_INFO', coreSkillSection)
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

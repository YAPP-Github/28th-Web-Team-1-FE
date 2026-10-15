import type { ResumeFormSection } from './resume-form.types'

/**
 * CORE_SKILL 섹션에 '이력서 최초 생성 과정에서 만들어진' 아이템(isInitialItem)이 아직 남아 있으면
 * AI 핵심역량이 채워지지 않은 상태라 자동 생성이 필요하다. PC 편집·모바일 미리보기가 진입 시 함께 쓴다.
 * 한번 생성해 저장하면 서버가 아이템을 비-초기로 기록하므로, 이후 진입에서는 사용자가 편집한 내용을 덮어쓰지 않는다.
 *
 * @param sections 폼 초기값(`resumeToFormValues`)의 섹션. 서버에 CORE_SKILL이 없어도 빈 섹션이 주입돼 있다.
 * @example
 * if (needsCoreCompetency(resumeToFormValues(resume).sections)) generate()
 */
export const needsCoreCompetency = (sections: ResumeFormSection[]) => sections.some((section) => section.type === 'CORE_SKILL' && section.items.some((item) => item.payload.coreSkill?.isInitialItem))

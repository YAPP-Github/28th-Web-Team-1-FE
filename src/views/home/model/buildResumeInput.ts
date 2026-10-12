import { type CreateResumeInput, type ResumeSectionType } from '@shared/lib/gql/graphql'

/**
 * 이력서 생성 시 채울 섹션 순서(표시 순서 = 배열 순서).
 * EXPERIENCE는 서버가 빈 섹션 생성을 막아(resume_section_item_required) 제외하고, 나머지는 서버 기본 아이템(useDefaultItems)을 사용한다.
 */
const CREATE_SECTION_TYPES: ResumeSectionType[] = ['BASIC_INFO', 'CORE_SKILL', 'CAREER', 'EDUCATION', 'AWARD', 'CERTIFICATE', 'LANGUAGE', 'SKILL']

/**
 * 경험 없이 이력서 생성(createResume) 스냅샷을 조립한다.
 * BASIC_INFO는 사용자(me)의 이름·이메일로, CORE_SKILL은 초기 아이템(isInitialItem)으로, 나머지 섹션은 useDefaultItems로 서버 기본값을 채운다.
 * @param jdId 이력서가 맞춰진 대상 채용공고 ID
 * @param me 기본 정보에 채울 사용자 이름·이메일
 * @example
 * ```ts
 * createResume(buildResumeInput(jdId, me))
 * ```
 */
export const buildResumeInput = (jdId: string, { name, email }: { name: string; email: string }): CreateResumeInput => {
  const sections = CREATE_SECTION_TYPES.map((type, displayOrder) => {
    if (type === 'BASIC_INFO') {
      return { type, displayOrder, visible: true, items: [{ displayOrder: 0, visible: true, payload: { basicInfo: { name, email } } }] }
    }
    if (type === 'CORE_SKILL') {
      return { type, displayOrder, visible: true, items: [{ displayOrder: 0, visible: true, payload: { coreSkill: { content: '', isInitialItem: true } } }] }
    }
    return { type, displayOrder, visible: true, useDefaultItems: true, items: [] }
  })

  return {
    sections,
    status: 'DRAFT',
    targetJdId: jdId,
    template: 'DEFAULT'
  }
}

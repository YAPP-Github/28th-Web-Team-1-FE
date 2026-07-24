import type { ResumeSectionItemPayloadInput, ResumeStatusType, ResumeTemplate, SaveResumeInput } from '@shared/lib/gql/graphql'
import type { ResumeFormItem, ResumeFormValues } from './resume-form.types'

/**
 * payload는 응답=입력 형태가 같아 대부분 그대로 왕복시키지만, `coreSkill.isInitialItem`은 서버가 관리하는 플래그다.
 * 일반 저장은 '이력서 최초 생성 과정'이 아니므로 항상 `false`로 내려, 최초 생성 아이템을 비-초기로 확정한다.
 * 그대로(true) 보내면 최초 생성 아이템이 계속 남아 진입할 때마다 핵심역량이 재생성된다.
 */
const toSavePayload = (payload: ResumeFormItem['payload']): ResumeSectionItemPayloadInput => (payload.coreSkill ? { ...payload, coreSkill: { content: payload.coreSkill.content, isInitialItem: false } } : payload)

/** 저장 시 섹션·아이템과 함께 보내야 하는 이력서 상위 메타. 이 화면에서는 편집하지 않고 서버 값을 그대로 왕복시킨다. */
interface SaveMeta {
  status: ResumeStatusType
  template: ResumeTemplate
  targetJdId: string | null
}

/**
 * 폼 값을 `updateResume`의 전체 스냅샷 입력(`SaveResumeInput`)으로 변환한다.
 *
 * - `sectionId`/`itemId`가 `null`(신규)이면 생략해 서버가 새로 생성하게 한다.
 * - `displayText`는 서버가 섹션 타입 기준으로 관리하므로 보내지 않는다.
 * - `displayOrder`는 배열 index로 정규화해 보낸다. 폼 배열 순서가 곧 표시 순서이다.
 * - payload는 응답=입력 형태가 같아 그대로 전달한다.
 */
export const formToSaveInput = (values: ResumeFormValues, meta: SaveMeta): SaveResumeInput => ({
  status: meta.status,
  template: meta.template,
  targetJdId: meta.targetJdId,
  sections: values.sections.map((section, sectionIndex) => ({
    sectionId: section.sectionId ?? undefined,
    type: section.type,
    displayOrder: sectionIndex,
    visible: section.visible,
    items: section.items.map((item, itemIndex) => ({
      itemId: item.itemId ?? undefined,
      displayOrder: itemIndex,
      visible: item.visible,
      payload: toSavePayload(item.payload)
    }))
  }))
})

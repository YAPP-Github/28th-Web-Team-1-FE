import type { ResumeQuery } from '@shared/lib/gql/graphql'
import type { ResumeFormValues } from './resume-form.types'

/**
 * 서버 이력서 상세(`resume`)를 폼 초기값(`defaultValues`)으로 변환한다.
 *
 * 저장 시 요청에 없는 섹션·아이템은 서버가 삭제하므로, **노출 여부와 무관하게 모든 섹션·아이템을
 * 그대로 담아야 한다. (미리보기·목차의 visible 필터는 표시 단계에서만 적용)
 * payload는 응답=입력 형태가 같아 그대로 전달한다.
 */
export const resumeToFormValues = (resume: ResumeQuery['resume']): ResumeFormValues => ({
  sections: resume.sections.map((section) => ({
    sectionId: section.sectionId,
    type: section.type,
    displayText: section.displayText,
    displayOrder: section.displayOrder,
    visible: section.visible,
    items: section.items.map((item) => ({
      itemId: item.itemId,
      displayOrder: item.displayOrder,
      visible: item.visible,
      payload: item.payload
    }))
  }))
})

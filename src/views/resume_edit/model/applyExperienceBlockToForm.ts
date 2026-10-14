import type { UseFormReturn } from 'react-hook-form'
import { createFormItem, nextDisplayOrder, type ResumeFormValues } from './resume-form.types'

/**
 * AI 응답 block을 EXPERIENCE 섹션 항목 하나에 반영한다.
 *
 * 한 질문방(questionRoomId)은 이력서의 경험 항목 하나에 대응한다. 항목의
 * `payload.experience.experienceQuestionRoomId`가 같으면 그 항목을 찾아 갱신하고,
 * 없으면 새 항목을 추가한다. 재적용 시에도 항목이 중복 생성되지 않도록 같은 항목을 덮어쓴다.
 *
 * - `block.title` → 경험명(`name`), `block.bullets`를 `- ` 목록으로 이어붙인 문자열 → 세부내용(`contents`)
 * - 기존 항목 갱신 시 `role`/`period`/`experienceQuestionRoomId`는 보존한다.
 * - 신규 항목은 `role`/`period`를 `null`로 둔다.
 *
 * `setValue`가 dirty를 유발해 이후 자동저장/저장에 함께 반영된다.
 *
 * @returns 방금 반영된 경험 항목의 uid
 */

interface ApplyExperienceBlockToFormProps {
  sectionIndex: number
  experienceQuestionRoomId: string
  block: { title: string; bullets: string[] }
}

export const applyExperienceBlockToForm = (form: UseFormReturn<ResumeFormValues>, { sectionIndex, experienceQuestionRoomId, block }: ApplyExperienceBlockToFormProps): string => {
  const items = form.getValues(`sections.${sectionIndex}.items`) ?? []
  const name = block.title
  const contents = block.bullets.map((bullet) => `- ${bullet}`).join('\n')

  const matchedIndex = items.findIndex((item) => item.payload.experience?.experienceQuestionRoomId === experienceQuestionRoomId)
  if (matchedIndex >= 0) {
    form.setValue(`sections.${sectionIndex}.items.${matchedIndex}.payload.experience.name`, name, { shouldDirty: true, shouldValidate: true })
    form.setValue(`sections.${sectionIndex}.items.${matchedIndex}.payload.experience.contents`, contents, { shouldDirty: true, shouldValidate: true })
    return items[matchedIndex].uid
  }

  const newItem = createFormItem({ experience: { name, role: null, period: null, contents, experienceQuestionRoomId } }, nextDisplayOrder(items))

  form.setValue(`sections.${sectionIndex}.items`, [...items, newItem], { shouldDirty: true, shouldValidate: true })
  return newItem.uid
}

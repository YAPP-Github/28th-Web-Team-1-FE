import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormItem, type ResumeFormValues } from '../model/resume-form.types'

/**
 * 편집 섹션의 아이템 목록(`sections.${sectionIndex}.items`)을 다루는 공용 훅.
 *
 * `useFieldArray` 결과를 그대로 돌려주고, 신규 아이템 추가 시 매번 반복하던
 * 공통 필드(`uid`/`itemId`/`displayOrder`/`visible`) 조립을 `addItem`에 캡슐화한다.
 *
 * @example
 * ```tsx
 * const { fields, remove, addItem } = useSectionItems(sectionIndex)
 * addItem({ award: { name: '', organization: null, awardedAt: null } })
 * ```
 */
export const useSectionItems = (sectionIndex: number) => {
  const { control, getValues } = useFormContext<ResumeFormValues>()
  const name = `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues>
  const fieldArray = useFieldArray({ control, name })

  /**
   * 섹션 타입 payload만 넘기면 나머지 공통 필드와 나머지 payload 키는 이 훅이 채운다.
   * `displayOrder`는 클로저가 아닌 런타임 시점 값으로 계산해 연속 추가 시 중복을 막는다.
   */
  const addItem = (payload: Partial<ResumeFormItem['payload']>) =>
    fieldArray.append({
      uid: crypto.randomUUID(),
      itemId: null,
      displayOrder: nextDisplayOrder(getValues(name) ?? fieldArray.fields),
      visible: true,
      payload: { ...emptyItemPayload, ...payload }
    })

  return { ...fieldArray, addItem }
}

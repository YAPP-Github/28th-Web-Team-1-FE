import type { ResumeQuery } from '@shared/lib/gql/graphql'

/**
 * 편집 화면 전체가 공유하는 react-hook-form 폼 값 타입.
 *
 * 서버 응답(`ResumeQuery`)의 섹션·아이템 구조를 그대로 재사용하되, `sectionId`/`itemId`만
 * `string | null`로 넓힌다. `null`은 아직 서버에 저장되지 않은 신규 섹션·아이템을 뜻하며,
 * 저장 시 id를 생략해 보내면 서버가 새로 생성한다.
 */
type QuerySection = ResumeQuery['resume']['sections'][number]
type QueryItem = QuerySection['items'][number]

export type ResumeFormItem = Omit<QueryItem, 'itemId'> & {
  itemId: string | null
  /**
   * 클라이언트 전용 안정 식별자. 미리보기 아이템 드래그 정렬의 key/dnd id로 쓴다.
   * 서버 `itemId`는 신규(미저장) 아이템에서 null이라 식별자로 부적합하고, `useFieldArray`의 `field.id`는
   * reorder 시 다른 인스턴스의 값과 어긋날 수 있어 별도로 둔다. 저장 시엔 전송하지 않는다.
   * (기존 아이템은 `uid = itemId`, 신규 아이템은 새 UUID)
   */
  uid: string
}

export type ResumeFormSection = Omit<QuerySection, 'sectionId' | 'items'> & {
  /**
   * 클라이언트 전용 안정 식별자. 섹션 선택/활성 추적에 쓴다.
   * 서버 `sectionId`는 신규(미저장) 섹션에서 null이라 식별자로 부적합해 별도로 둔다. 저장 시엔 전송하지 않는다.
   * (기존 섹션은 `uid = sectionId`, 신규 섹션은 새 UUID)
   */
  uid: string
  sectionId: string | null
  items: ResumeFormItem[]
}

export type ResumeFormValues = { sections: ResumeFormSection[] }

/**
 * 새 아이템 추가 시 부여할 displayOrder. 기존 값들의 최댓값 + 1이라 삭제로 번호가 비어도 중복되지 않는다.
 * 서버 displayOrder가 1부터 시작하는 것에 맞춰 빈 목록은 1을 준다.
 */
export const nextDisplayOrder = (items: Array<{ displayOrder: number }>): number => (items.length ? Math.max(...items.map((item) => item.displayOrder)) + 1 : 1)

/**
 * 신규 아이템 추가 시 쓰는 빈 payload. 폼 payload 타입은 9개 키가 모두 존재(각각 nullable)해야 하므로,
 * 이 기본값을 펼친 뒤 섹션 타입에 해당하는 키만 채운다.
 * 예: `{ ...emptyItemPayload, career: { companyName: '', role: null, contents: '', period: null } }`
 */
export const emptyItemPayload: ResumeFormItem['payload'] = {
  award: null,
  basicInfo: null,
  career: null,
  certificate: null,
  coreSkill: null,
  education: null,
  experience: null,
  language: null,
  skill: null
}

/**
 * 신규 아이템 객체를 조립한다. `emptyItemPayload`를 깔고 섹션 타입 payload만 덮어쓰며,
 * 공통 필드(`uid`/`itemId`/`displayOrder`/`visible`)를 한 곳에서 채운다.
 *
 * `displayOrder`는 삽입 방식(폼 초기값/append/setValue)마다 기준이 달라 호출부가 계산해 넘긴다.
 * 기존 아이템은 `uid = itemId`, 신규 아이템은 새 UUID를 쓴다(여기선 항상 신규).
 */
export const createFormItem = (payload: Partial<ResumeFormItem['payload']>, displayOrder: number): ResumeFormItem => ({
  uid: crypto.randomUUID(),
  itemId: null,
  displayOrder,
  visible: true,
  payload: { ...emptyItemPayload, ...payload }
})

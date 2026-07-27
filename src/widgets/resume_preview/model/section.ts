import type { ResumeQuery } from '@shared/lib/gql/graphql'

type QuerySection = ResumeQuery['resume']['sections'][number]
type QueryItem = QuerySection['items'][number]

/**
 * 미리보기가 다루는 섹션·아이템 shape.
 *
 * 편집 폼(`ResumeFormSection`: sectionId/itemId가 신규 시 null)과 서버 응답(`ResumeQuery`) 양쪽이
 * 그대로 대입되도록 id를 `string | null`로 넓힌다. 미리보기는 표시에만 관여하므로 폼 전용 필드(uid 등)는 요구하지 않는다.
 */
export type ResumeSectionItem = Omit<QueryItem, 'itemId'> & { itemId: string | null }
export type ResumeSectionData = Omit<QuerySection, 'sectionId' | 'items'> & {
  sectionId: string | null
  items: ResumeSectionItem[]
}

type SectionItems = ResumeSectionData['items']

/** 섹션 아이템들에서 해당 타입의 payload만 뽑아 null을 제거한다. (미리보기·편집 switch 공통) */
export const payloadsOf = <K extends keyof SectionItems[number]['payload']>(items: SectionItems, key: K) =>
  items.flatMap((item) => {
    const payload = item.payload[key]
    return payload === null ? [] : [{ ...payload, itemId: item.itemId }]
  })

/** 순서는 배열 순서가 곧 표시 순서다(정렬 안 함). displayOrder는 저장 시 index로 부여된다.*/
export const visibleItems = (section: ResumeSectionData): ResumeSectionData['items'] => section.items.filter((item) => item.visible)

/** 아이템 하나의 대표 라벨. payload 타입과 무관하게 대표 이름 필드를 뽑는다. (목차·미니맵 공통) */
export const getItemLabel = (item: ResumeSectionData['items'][number]): string => {
  const p = item.payload
  return (
    p.experience?.name ??
    p.career?.companyName ??
    p.education?.schoolName ??
    p.award?.name ??
    p.certificate?.name ??
    p.language?.examName ??
    p.skill?.name ??
    p.coreSkill?.content ??
    p.basicInfo?.name ??
    ''
  )
}

/** 목차(ResumeIndex)에 표시할 아이템 라벨 목록. 빈 라벨은 제외한다. */
export const getSectionItemLabels = (section: ResumeSectionData): string[] =>
  visibleItems(section)
    .map(getItemLabel)
    .filter((label) => label.trim().length > 0)

const byDisplayOrder = <T extends { displayOrder: number }>(a: T, b: T) => a.displayOrder - b.displayOrder

/**
 * 서버 이력서 상세의 섹션들을 미리보기용으로 정렬해 헤더 전용 `BASIC_INFO`와 노출 본문 섹션으로 나눈다.
 * 섹션·아이템 모두 displayOrder 오름차순으로 정렬한다(응답 순서에 의존하지 않는다).
 * 편집 화면은 폼 배열 순서를 직접 쓰므로 이 헬퍼는 읽기 전용 상세(resume_detail)에서 사용한다.
 */
export const toPreviewSections = (sections: readonly ResumeSectionData[]) => {
  const sorted = [...sections].sort(byDisplayOrder).map((section) => ({ ...section, items: [...section.items].sort(byDisplayOrder) }))
  return {
    basicInfoSection: sorted.find((section) => section.type === 'BASIC_INFO') ?? null,
    bodySections: sorted.filter((section) => section.visible && section.type !== 'BASIC_INFO')
  }
}

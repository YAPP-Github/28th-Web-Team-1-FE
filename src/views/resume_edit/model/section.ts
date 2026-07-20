import type { ResumeQuery } from '@shared/lib/gql/graphql'

export type ResumeSectionData = ResumeQuery['resume']['sections'][number]
type SectionItems = ResumeSectionData['items']

/** 섹션 아이템들에서 해당 타입의 payload만 뽑아 null을 제거한다. (미리보기·편집 switch 공통) */
export const payloadsOf = <K extends keyof SectionItems[number]['payload']>(items: SectionItems, key: K) =>
  items.flatMap((item) => {
    const payload = item.payload[key]
    return payload === null ? [] : [{ ...payload, itemId: item.itemId }]
  })

/** 노출(visible) 아이템만 displayOrder 순으로 정렬해 돌려준다. (미리보기·목차·편집 공통) */
export const visibleSortedItems = (section: ResumeSectionData): ResumeSectionData['items'] => [...section.items].filter((item) => item.visible).sort((a, b) => a.displayOrder - b.displayOrder)

/** 목차(ResumeIndex)에 표시할 아이템 라벨. payload 타입과 무관하게 대표 이름 필드를 뽑는다. */
export const getSectionItemLabels = (section: ResumeSectionData): string[] =>
  visibleSortedItems(section)
    .map((item) => {
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
    })
    .filter((label) => label.trim().length > 0)

import type { ResumeFormSection } from './resume-form.types'

export type ResumeSectionData = ResumeFormSection
type SectionItems = ResumeSectionData['items']

/** 섹션 아이템들에서 해당 타입의 payload만 뽑아 null을 제거한다. (미리보기·편집 switch 공통) */
export const payloadsOf = <K extends keyof SectionItems[number]['payload']>(items: SectionItems, key: K) =>
  items.flatMap((item) => {
    const payload = item.payload[key]
    return payload === null ? [] : [{ ...payload, itemId: item.itemId }]
  })

/** 순서는 폼 배열 순서가 곧 표시 순서다(정렬 안 함). displayOrder는 저장 시 index로 부여된다.*/
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

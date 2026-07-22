import { type CreateResumeInput, type ResumeSectionType, type SaveResumeSectionItemInput } from '@shared/lib/gql/graphql'
import type { Experience } from './experience.types'

/**
 * 이력서 생성 시 채울 섹션 순서(표시 순서 = 배열 순서).
 * EXPERIENCE만 선택된 경험으로 items를 채우고, 나머지는 서버 기본 아이템(useDefaultItems)을 사용한다.
 */
const CREATE_SECTION_TYPES: ResumeSectionType[] = [
  'BASIC_INFO',
  'CORE_SKILL',
  'EXPERIENCE',
  'CAREER',
  'EDUCATION',
  'AWARD',
  'CERTIFICATE',
  'LANGUAGE',
  'SKILL'
]

/**
 * 경험 상세 내용(구조화된 FREE/STAR)을 이력서 payload용 단일 문자열로 평탄화한다.
 * - FREE: 자유 서술 내용을 그대로 사용
 * - STAR: 상황/과제/행동/결과에 라벨을 붙여 줄바꿈으로 결합
 */
export const flattenExperienceContents = (contents: Experience['contents']): string => {
  if (contents.type === 'FREE') {
    return contents.free?.content ?? ''
  }

  const star = contents.star
  if (!star) return ''

  return [`- ${star.situation}`, `- ${star.task}`, `- ${star.action}`, `- ${star.result}`].join('\n')
}

/**
 * 선택된 경험들로 이력서 생성(createResume) 스냅샷을 조립한다.
 * EXPERIENCE 섹션은 선택된 경험으로 items를 채우고, 나머지 섹션은 useDefaultItems로 서버 기본값을 채운다.
 * @param experiences 선택된 경험 목록(순서 = 표시 순서)
 * @param jdId 이력서가 맞춰진 대상 채용공고 ID
 */
export const buildResumeInput = (experiences: Experience[], jdId: string): CreateResumeInput => {
  const experienceItems: SaveResumeSectionItemInput[] = experiences.map((experience, index) => ({
    displayOrder: index,
    visible: true,
    payload: {
      experience: {
        name: experience.title,
        role: experience.role ?? null,
        period: experience.period ?? null,
        contents: flattenExperienceContents(experience.contents)
      }
    }
  }))

  const sections = CREATE_SECTION_TYPES.map((type, displayOrder) => {
    // EXPERIENCE는 선택된 경험을 직접 채우고, 나머지는 서버 기본 아이템을 사용한다(useDefaultItems=true → items는 비어 있어야 함).
    if (type === 'EXPERIENCE') {
      return { type, displayOrder, visible: true, items: experienceItems }
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

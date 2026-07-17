import { type SaveResumeInput, type SaveResumeSectionItemInput } from '@shared/lib/gql/graphql'
import type { Experience } from './experience.types'

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

  return [`상황: ${star.situation}`, `과제: ${star.task}`, `행동: ${star.action}`, `결과: ${star.result}`].join('\n')
}

/**
 * 선택된 경험들로 이력서 생성(createResume) 스냅샷을 조립한다.
 * 현재는 EXPERIENCE 섹션만 채우며, 나머지 섹션은 이후 에디터에서 편집한다.
 * @param experiences 선택된 경험 목록(순서 = 표시 순서)
 * @param jdId 이력서가 맞춰진 대상 채용공고 ID
 */
export const buildResumeInput = (experiences: Experience[], jdId: string): SaveResumeInput => {
  const items: SaveResumeSectionItemInput[] = experiences.map((experience, index) => ({
    displayOrder: index,
    visible: true,
    payload: {
      experience: {
        name: experience.title,
        role: experience.project?.role ?? null,
        period: experience.project?.period ?? null,
        contents: flattenExperienceContents(experience.contents)
      }
    }
  }))

  return {
    sections: [
      {
        type: 'EXPERIENCE',
        displayOrder: 0,
        visible: true,
        items
      }
    ],
    status: 'DRAFT',
    targetJdId: jdId,
    template: 'DEFAULT'
  }
}

import { type CreateResumeInput, type ResumeSectionType, type SaveResumeSectionItemInput } from '@shared/lib/gql/graphql'
import type { Experience } from './experience.types'

/**
 * 이력서 생성 시 채울 섹션 순서(표시 순서 = 배열 순서).
 * EXPERIENCE만 선택된 경험으로 items를 채우고, 나머지는 서버 기본 아이템(useDefaultItems)을 사용한다.
 */
const CREATE_SECTION_TYPES: ResumeSectionType[] = ['BASIC_INFO', 'CORE_SKILL', 'EXPERIENCE', 'CAREER', 'EDUCATION', 'AWARD', 'CERTIFICATE', 'LANGUAGE', 'SKILL']

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

  const coreSkillItems: SaveResumeSectionItemInput[] = [
    {
      displayOrder: 0,
      visible: true,
      payload: {
        coreSkill: {
          isInitialItem: true,
          content:
            '사용자 경험을 최적화하는 데 집중하는 프론트엔드 개발자입니다. 저사양 기기에서도 빠르고 원활한 사용자 경험을 제공하기 위해 성능 개선을 꾸준히 실천해왔습니다. 불필요한 데이터 조회를 방지하고 최적화하는 작업을 통해 서버 부하를 줄이고 응답 속도를 향상시킵니다. 사용자 요구에 맞춘 데이터 제공을 통해 전반적인 만족도를 높이는 데 강점이 있습니다. 다양한 기술 스택을 활용해 효율적인 문제 해결 방법을 모색하며, 협업을 통해 더 나은 결과를 만들어내는 것을 중요하게 생각합니다.'
        }
      }
    }
  ]

  const sections = CREATE_SECTION_TYPES.map((type, displayOrder) => {
    // EXPERIENCE와 CORE_SKILL은 값을 직접 채우고, 나머지는 서버 기본 아이템을 사용한다(useDefaultItems=true → items는 비어 있어야 함).
    if (type === 'EXPERIENCE') {
      return { type, displayOrder, visible: true, items: experienceItems }
    }
    if (type === 'CORE_SKILL') {
      return { type, displayOrder, visible: true, items: coreSkillItems }
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

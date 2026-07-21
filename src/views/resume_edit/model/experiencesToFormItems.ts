import { flattenExperienceContents, type Experience } from '@views/resume_create'
import { emptyItemPayload, type ResumeFormItem } from './resume-form.types'

/**
 * 경험 재선택 다이얼로그에서 고른 경험들을 EXPERIENCE 섹션의 폼 아이템으로 변환한다.
 * 재선택은 기존 아이템을 통째로 교체(replace)하므로 모두 `itemId: null`(신규)로 만들어,
 * 저장 시 서버가 기존 아이템을 지우고 새로 생성하도록 한다.
 * `displayOrder`는 서버 규약(1부터)에 맞춰 1-based로 부여한다.
 *
 * 매핑은 생성 플로우(`buildResumeInput`)와 동일하되, 반환 타입만 API 입력이 아닌 폼 아이템이다.
 * @param experiences 선택된 경험 목록(순서 = 표시 순서)
 */
export const experiencesToFormItems = (experiences: Experience[]): ResumeFormItem[] =>
  experiences.map((experience, index) => ({
    itemId: null,
    displayOrder: index + 1,
    visible: true,
    payload: {
      ...emptyItemPayload,
      experience: {
        name: experience.title,
        role: experience.role,
        period: experience.period,
        contents: flattenExperienceContents(experience.contents)
      }
    }
  }))

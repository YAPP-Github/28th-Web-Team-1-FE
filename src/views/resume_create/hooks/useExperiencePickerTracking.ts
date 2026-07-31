'use client'
import { useEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { experienceQueries } from '@entities/experience'
import type { Experience } from '../model/experience.types'

export type ExperiencePickerActionType = 'first' | 'reselect'

interface UseExperiencePickerTrackingParams {
  workspaceId: string
  jdId: string
  isOpen: boolean
  actionType: ExperiencePickerActionType
  // reselect 시 이전에 선택된 경험 ID들. 새로 선택된 경험과 같은 인덱스로 짝지어 previous_experience_id로 보낸다.
  previousExperienceIds?: string[]
}

/**
 * ExperiencePickerDialog의 Amplitude 이벤트 전송을 담당하는 훅
 * @example
 * ```tsx
 * const { trackSelected } = useExperiencePickerTracking({ workspaceId, jdId, isOpen, actionType, previousExperienceIds })
 * trackSelected(selectedItems)
 * ```
 */
export const useExperiencePickerTracking = ({ workspaceId, jdId, isOpen, actionType, previousExperienceIds }: UseExperiencePickerTrackingParams) => {
  useEffect(() => {
    if (!isOpen) return
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_SELECTION_VIEWED, { jd_id: jdId })
  }, [isOpen, jdId])

  const { data: matchedPages } = useInfiniteQuery(experienceQueries.matched(workspaceId, jdId))
  const recommendationRankMap = useMemo(() => buildRecommendationRankMap(matchedPages?.pages.flatMap((page) => page.experiences.experiences) ?? []), [matchedPages])

  const trackSelected = (selected: Experience[]) => {
    selected.forEach((experience, index) => {
      const rank = recommendationRankMap.get(experience.experienceId)

      amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_SELECTED, {
        experience_id: experience.experienceId,
        is_recommended: Boolean(experience.recommendedReason), // 추천 이유가 있다면 추천 경험으로 간주
        ...(rank !== undefined && { recommendation_rank: rank }),
        action_type: actionType,
        new_experience_id: actionType === 'reselect' ? experience.experienceId : null,
        previous_experience_id: actionType === 'reselect' ? (previousExperienceIds?.[index] ?? null) : null,
        jd_id: jdId
      })
    })
  }

  return { trackSelected }
}

/** 추천(recommendedReason 보유) 경험만 matchRate를 내림차순으로 정렬해 1부터 순위를 매긴다. 비추천 경험은 맵에 없다. */
const buildRecommendationRankMap = (experiences: Experience[]): Map<string, number> => {
  const recommended = experiences.filter((experience) => Boolean(experience.recommendedReason)).sort((a, b) => (b.matchRate ?? 0) - (a.matchRate ?? 0))
  return new Map(recommended.map((experience, index) => [experience.experienceId, index + 1]))
}

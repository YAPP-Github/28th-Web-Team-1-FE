'use client'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Amplitude `previous_experience_id` 추적용으로, URL의 `initialExperienceIds` 쿼리로 이전 선택 경험 ID들을 시드한다.
 * 한 번 시드로 소비한 뒤엔 주소창에서 `initialExperienceIds`만 지운다(다른 쿼리·해시는 보존). 마운트 시 1회만 실행한다.
 * @example
 * ```tsx
 * const { previousExperienceIds, setPreviousExperienceIds } = usePreviousExperienceIdsTracking()
 * setPreviousExperienceIds(experiences.map((experience) => experience.experienceId)) // 재선택 완료 시 갱신
 * ```
 */
export const usePreviousExperienceIdsTracking = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [previousExperienceIds, setPreviousExperienceIds] = useState<string[]>(() => searchParams.get('initialExperienceIds')?.split(',').filter(Boolean) ?? [])

  useEffect(() => {
    if (!searchParams.has('initialExperienceIds')) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete('initialExperienceIds')
    const query = params.toString()
    window.history.replaceState(null, '', `${pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { previousExperienceIds, setPreviousExperienceIds }
}

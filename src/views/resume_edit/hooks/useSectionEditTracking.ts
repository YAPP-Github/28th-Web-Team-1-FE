'use client'
import { useRef } from 'react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

type SectionEditName = 'core_competency' | 'experience' | 'career'
type SectionEditLocation = 'editor' | 'ai_modal'

/**
 * Amplitude 이벤트 전송용 훅. `sectionName`이 없으면 아무 일도 하지 않는다.
 * @example
 * ```tsx
 * const { handleFocus, handleChange } = useSectionEditTracking('experience', 'editor', jdId)
 * <input onFocus={(e) => handleFocus(e.target.value)} onChange={(e) => { handleChange(e.target.value); field.onChange(e) }} />
 * ```
 */
export const useSectionEditTracking = (sectionName: SectionEditName, location: SectionEditLocation, jdId: string | null) => {
  const valueAtFocusRef = useRef<string | null>(null)

  const handleFocus = (currentValue: string) => {
    valueAtFocusRef.current = currentValue
  }

  const handleChange = (nextValue: string) => {
    if (valueAtFocusRef.current === null || nextValue === valueAtFocusRef.current) return
    amplitude.track(AMPLITUDE_EVENTS.SECTION_EDITED, { jd_id: jdId, section_name: sectionName, location })
    valueAtFocusRef.current = null
  }

  return { handleFocus, handleChange }
}

'use client'
import { useRef } from 'react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

type SectionEditName = 'core_competency' | 'experience' | 'career'
type SectionEditLocation = 'editor' | 'ai_modal'

interface UseSectionEditTrackingProps {
  sectionName: SectionEditName
  location: SectionEditLocation
  aiBlockId?: string | null
}

/**
 * Amplitude 이벤트 전송용 훅. `sectionName`이 없으면 아무 일도 하지 않는다.
 * `aiBlockId`가 있으면 AI 대화방 [적용]으로 생긴 블록을 수정한 것으로 보고 `is_ai_generated_block: true`로 보낸다.
 * @example
 * ```tsx
 * const { handleFocus, handleChange } = useSectionEditTracking({ sectionName: 'experience', location: 'editor' })
 * <input onFocus={(e) => handleFocus(e.target.value)} onChange={(e) => { handleChange(e.target.value); field.onChange(e) }} />
 * ```
 */
export const useSectionEditTracking = ({ sectionName, location, aiBlockId = null }: UseSectionEditTrackingProps) => {
  const valueAtFocusRef = useRef<string | null>(null)

  const handleFocus = (currentValue: string) => {
    valueAtFocusRef.current = currentValue
  }

  const handleChange = (nextValue: string) => {
    if (valueAtFocusRef.current === null || nextValue === valueAtFocusRef.current) return
    amplitude.track(AMPLITUDE_EVENTS.SECTION_EDITED, { section_name: sectionName, location, is_ai_generated_block: aiBlockId !== null, block_id: aiBlockId })
    valueAtFocusRef.current = null
  }

  return { handleFocus, handleChange }
}

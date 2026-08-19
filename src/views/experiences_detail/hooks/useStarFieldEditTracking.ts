'use client'
import { useRef } from 'react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

type StarField = 'situation' | 'task' | 'action' | 'result'

/**
 * StarEditor의 S/T/A/R 필드 Amplitude 이벤트 전송용 훅. focus 시점 값과 실제로 달라졌을 때만 전송한다(단순 focus만으로는 전송 안 함).
 * 필드 4개가 한 컴포넌트에서 동시에 존재하므로 focus 시점 값을 필드별로 따로 기억한다.
 * @example
 * ```tsx
 * const { handleFocus, handleChange } = useStarFieldEditTracking()
 * <Textarea onFocus={() => handleFocus('situation', values.situation)} onChange={(e) => { handleChange('situation', e.target.value); setValues(...) }} />
 * ```
 */
export const useStarFieldEditTracking = () => {
  const valueAtFocusRef = useRef<Record<StarField, string | null>>({ situation: null, task: null, action: null, result: null })

  const handleFocus = (field: StarField, currentValue: string) => {
    valueAtFocusRef.current[field] = currentValue
  }

  const handleChange = (field: StarField, nextValue: string) => {
    const valueAtFocus = valueAtFocusRef.current[field]
    if (valueAtFocus === null || nextValue === valueAtFocus) return
    amplitude.track(AMPLITUDE_EVENTS.STAR_FIELD_EDITED, { field })
    valueAtFocusRef.current[field] = null
  }

  return { handleFocus, handleChange }
}

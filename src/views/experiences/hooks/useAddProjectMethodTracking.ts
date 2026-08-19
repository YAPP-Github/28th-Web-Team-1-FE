'use client'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

type AddProjectMethod = 'pdf' | 'write' | 'notion'

/**
 * AddProjectDefaultView의 "경험 추가 방법 선택" Amplitude 이벤트 전송을 담당하는 훅
 * @example
 * ```tsx
 * const { trackMethodSelected } = useAddProjectMethodTracking()
 * trackMethodSelected('pdf')
 * ```
 */
export const useAddProjectMethodTracking = () => {
  const trackMethodSelected = (method: AddProjectMethod) => {
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_ADD_METHOD_SELECTED, { method })
  }

  return { trackMethodSelected }
}

'use client'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

type ProjectTarget = 'new' | 'existing'

/**
 * AddProjectDialog의 "직접 입력 경험 제출" Amplitude 이벤트 전송을 담당하는 훅.
 * 요청 결과(`is_success`)까지 담기 위해 클릭이 아니라 응답 시점에 호출한다.
 * @example
 * ```tsx
 * const { trackTextSubmitted } = useExperienceTextSubmittedTracking()
 * createExperience(input, { onSuccess: () => trackTextSubmitted(content, 'existing', true) })
 * ```
 */
export const useExperienceTextSubmittedTracking = () => {
  const trackTextSubmitted = (content: string, projectTarget: ProjectTarget, isSuccess: boolean) => {
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_TEXT_SUBMITTED, { text_length: content.trim().length, project_target: projectTarget, is_success: isSuccess })
  }

  return { trackTextSubmitted }
}

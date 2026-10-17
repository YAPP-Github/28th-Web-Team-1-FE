'use client'
import { useEffect } from 'react'
import * as amplitude from '@amplitude/unified'
import { useMeQuery } from '@entities/user'
import { AMPLITUDE_EVENTS, FIRST_HOME_VISIT_COOKIE } from '@shared/config'

/**
 * home_viewed를 보낸다. 가입 직후 첫 홈 진입이면(구글 콜백이 심은 일회용 쿠키) is_first_visit을 true로 남긴다.
 * userId가 들어온 뒤에 보내야 전역 `AmplitudeIdentify`의 setUserId·sign_up_completed 다음 순서로 나간다.
 */
export const HomeViewTracker = () => {
  const { data } = useMeQuery()
  const userId = data?.me.userId

  useEffect(() => {
    if (!userId) return
    const isFirstVisit = document.cookie.split('; ').includes(`${FIRST_HOME_VISIT_COOKIE}=1`)
    if (isFirstVisit) document.cookie = `${FIRST_HOME_VISIT_COOKIE}=; path=/; max-age=0`
    amplitude.track(AMPLITUDE_EVENTS.HOME_VIEWED, { is_first_visit: isFirstVisit })
  }, [userId])

  return null
}

'use client'
import { useEffect } from 'react'
import * as amplitude from '@amplitude/unified'
import { useMeQuery } from '@entities/user'
import { AMPLITUDE_EVENTS, SIGN_UP_COMPLETED_COOKIE } from '@shared/config'

/**
 * 로그인한 유저의 userId를 Amplitude User ID로 등록한다. 기기가 바뀌어도 Amplitude에서 같은 유저로 묶이게 하기 위함.
 * 신규 가입 직후(구글 콜백이 심은 일회용 쿠키가 있으면) userId 등록 뒤 sign_up_completed를 1회 보내고 쿠키를 지운다.
 */
export const AmplitudeIdentify = () => {
  const { data } = useMeQuery()
  const userId = data?.me.userId

  useEffect(() => {
    if (!userId) return
    amplitude.setUserId(userId)

    if (!document.cookie.split('; ').includes(`${SIGN_UP_COMPLETED_COOKIE}=1`)) return
    document.cookie = `${SIGN_UP_COMPLETED_COOKIE}=; path=/; max-age=0`
    amplitude.identify(new amplitude.Identify().setOnce('signup_version', 'v1.1'))
    amplitude.track(AMPLITUDE_EVENTS.SIGN_UP_COMPLETED)
  }, [userId])

  return null
}

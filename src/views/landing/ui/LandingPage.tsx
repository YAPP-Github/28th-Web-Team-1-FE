'use client'
import { Suspense, useEffect } from 'react'
import { LandingPageA } from './LandingPageA'
import { LandingPageB } from './LandingPageB'

import { useSearchParams } from 'next/navigation'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

export const LandingPage = () => {
  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.LANDING_VIEWED)
  }, [])

  // 정적 렌더엔 A가 들어가고, 클라이언트에서 variant를 읽어 바꾼다
  return (
    <Suspense fallback={<LandingPageA />}>
      <LandingVariant />
    </Suspense>
  )
}

/** 랜딩 A/B 분기. 배정 로직 전이라 `?landing=B`로만 B안을 본다. 배정 붙이면 이 조건만 교체 */
const LandingVariant = () => (useSearchParams().get('landing') === 'B' ? <LandingPageB /> : <LandingPageA />)

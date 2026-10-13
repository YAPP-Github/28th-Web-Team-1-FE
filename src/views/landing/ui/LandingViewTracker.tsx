'use client'
import { useEffect } from 'react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

/** landing_viewed를 보낸다. AB-TEST(landing): variant가 있으면 유저·이벤트 속성에 landing_variant를 남긴다. */
// TODO : AB-TEST(landing)
export const LandingViewTracker = ({ variant }: { variant?: string }) => {
  useEffect(() => {
    if (variant) amplitude.identify(new amplitude.Identify().set('landing_variant', variant))
    amplitude.track(AMPLITUDE_EVENTS.LANDING_VIEWED, variant ? { landing_variant: variant } : undefined)
  }, [variant])

  return null
}

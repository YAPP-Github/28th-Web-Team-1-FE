import { cookies } from 'next/headers'
import { LandingPageA } from './LandingPageA'
import { LandingPageB } from './LandingPageB'
import { LandingViewTracker } from './LandingViewTracker'

import { LANDING_VARIANT_COOKIE } from '@shared/lib/landing-ab'

/** AB-TEST(landing): middleware가 배정한 쿠키대로 서버에서 A/B를 그린다. `?landing=B`로 QA 강제 가능(집계 제외). */
// TODO : AB-TEST(landing)
export const LandingPage = async ({ searchParams }: PageProps<'/'>) => {
  const { landing } = await searchParams
  const assigned = (await cookies()).get(LANDING_VARIANT_COOKIE)?.value

  return (
    <>
      <LandingViewTracker variant={landing ? undefined : assigned} />
      {(landing ?? assigned) === 'B' ? <LandingPageB /> : <LandingPageA />}
    </>
  )
}

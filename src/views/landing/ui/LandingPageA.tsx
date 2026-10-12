'use client'
import { Suspense } from 'react'
import { FooterCtaSection } from './FooterCtaSection'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ProcessStepsSection } from './ProcessStepsSection'
import { TaglineSection } from './TaglineSection'
import { UploadFeatureSection } from './UploadFeatureSection'

import { AuthErrorToast } from '@features/authenticate'

/** 랜딩 A/B 테스트의 A안 (기존 랜딩) */
export const LandingPageA = () => {
  return (
    <main className="mx-auto max-w-360 px-5 pt-20 md:px-8 md:pt-26.5">
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <LandingHeader />
      <HeroSection />
      <TaglineSection />
      <UploadFeatureSection />
      <ProcessStepsSection />
      <FooterCtaSection />
      <LandingFooter />
    </main>
  )
}

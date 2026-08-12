import { FooterCtaSection } from './FooterCtaSection'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ProcessStepsSection } from './ProcessStepsSection'
import { TaglineSection } from './TaglineSection'
import { UploadFeatureSection } from './UploadFeatureSection'

export const LandingPage = () => {
  return (
    <main className="mx-auto max-w-360 px-4 pt-20 md:px-8 md:pt-26.5">
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

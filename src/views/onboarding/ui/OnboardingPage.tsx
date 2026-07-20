'use client'
import { Suspense, type FC } from 'react'
import { useNotionReturn } from '@features/notion_connect'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow, type OnboardingStep, type OnboardingStepProps } from '../model/useOnboardingFlow'

const STEP_COMPONENTS: Record<Exclude<OnboardingStep, 'complete' | 'notion-page-select'>, FC<OnboardingStepProps>> = {
  'has-resume': HasResumeStep,
  'resume-upload': ResumeUploadStep,
  'resume-info': ResumeInfoStep,
  'notion-connect': NotionConnectStep
}

export const OnboardingPage = () => (
  <Suspense>
    <OnboardingFlow />
  </Suspense>
)

const OnboardingFlow = () => {
  const { connectionId } = useNotionReturn('/onboarding')
  const { step, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(connectionId ? 'notion-page-select' : undefined)

  if (step === 'complete') return <CompleteStep hasConnected={hasConnected} />

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  if (step === 'notion-page-select') return <NotionPageSelectStep {...stepProps} connectionId={connectionId ?? undefined} />

  const Step = STEP_COMPONENTS[step]
  return <Step {...stepProps} />
}

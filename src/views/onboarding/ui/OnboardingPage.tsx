'use client'
import type { FC } from 'react'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow, type OnboardingStep, type OnboardingStepProps } from '../model/useOnboardingFlow'

const STEP_COMPONENTS: Record<OnboardingStep, FC<OnboardingStepProps>> = {
  'has-resume': HasResumeStep,
  'resume-upload': ResumeUploadStep,
  'resume-info': ResumeInfoStep,
  'notion-connect': NotionConnectStep,
  'notion-page-select': NotionPageSelectStep,
  complete: CompleteStep
}

export const OnboardingPage = () => {
  const { step, next, skip, back, hasPrev, hasSkip } = useOnboardingFlow()
  const Step = STEP_COMPONENTS[step]

  return <Step onDone={next} onPrev={hasPrev ? back : undefined} onSkip={hasSkip ? skip : undefined} />
}

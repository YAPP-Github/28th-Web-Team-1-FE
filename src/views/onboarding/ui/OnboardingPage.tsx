'use client'
import type { FC } from 'react'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow, type OnboardingStep, type OnboardingStepProps } from '../model/useOnboardingFlow'

const STEP_COMPONENTS: Record<Exclude<OnboardingStep, 'complete'>, FC<OnboardingStepProps>> = {
  'has-resume': HasResumeStep,
  'resume-upload': ResumeUploadStep,
  'resume-info': ResumeInfoStep,
  'notion-connect': NotionConnectStep,
  'notion-page-select': NotionPageSelectStep
}

export const OnboardingPage = () => {
  const { step, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow()

  // 완료 화면만 통일 인터페이스 밖: 온보딩 중 연동 여부에 따라 CTA가 갈린다
  if (step === 'complete') return <CompleteStep hasConnected={hasConnected} />

  const Step = STEP_COMPONENTS[step]
  return <Step onDone={next} onPrev={hasPrev ? back : undefined} onSkip={hasSkip ? skip : undefined} />
}

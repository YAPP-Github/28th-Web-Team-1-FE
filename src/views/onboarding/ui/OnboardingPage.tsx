'use client'
import { Suspense, type ReactNode } from 'react'
import { useNotionReturn } from '@features/notion_connect'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'
import type { OnboardingStep, OnboardingStepProps } from '../model/onboardingFlow'

/** 대부분의 스텝엔 필요 없고, `notion-page-select`·`complete`만 공통 props 밖의 값을 쓴다. */
interface StepContext {
  connectionId?: string
  hasConnected: boolean
}

/** 스텝 → 렌더러 단일 테이블. 모든 스텝을 같은 방식(스텝 props + 공용 컨텍스트)으로 그려 분기를 없앤다. */
const STEP_RENDERERS: Record<OnboardingStep, (props: OnboardingStepProps, ctx: StepContext) => ReactNode> = {
  'has-resume': (props) => <HasResumeStep {...props} />,
  'resume-upload': (props) => <ResumeUploadStep {...props} />,
  'resume-info': (props) => <ResumeInfoStep {...props} />,
  'notion-connect': (props) => <NotionConnectStep {...props} />,
  'notion-page-select': (props, ctx) => <NotionPageSelectStep {...props} connectionId={ctx.connectionId} />,
  complete: (_props, ctx) => <CompleteStep hasConnected={ctx.hasConnected} />
}

export const OnboardingPage = () => (
  <Suspense>
    <OnboardingFlow />
  </Suspense>
)

const OnboardingFlow = () => {
  const { connectionId } = useNotionReturn('/onboarding')
  const { step, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(connectionId ? 'notion-page-select' : undefined)

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  return STEP_RENDERERS[step](stepProps, { connectionId: connectionId ?? undefined, hasConnected })
}

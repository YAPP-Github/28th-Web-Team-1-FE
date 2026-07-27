'use client'
import { Suspense, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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

// 다음(오른쪽→왼쪽) / 이전(왼쪽→오른쪽) 방향에 따라 들어오고 나가는 위치를 반대로 잡는다.
const stepVariants = {
  enter: (direction: 1 | -1) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction > 0 ? -32 : 32, opacity: 0 })
}

const OnboardingFlow = () => {
  const { connectionId } = useNotionReturn('/onboarding')
  const { step, direction, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(connectionId ? 'notion-page-select' : undefined)

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}>
        {STEP_RENDERERS[step](stepProps, { connectionId: connectionId ?? undefined, hasConnected })}
      </motion.div>
    </AnimatePresence>
  )
}

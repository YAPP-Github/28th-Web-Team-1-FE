'use client'
import { Suspense, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useNotionReturn } from '@features/notion_connect'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeProcessingStep } from './ResumeProcessingStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionRedirectStep } from './NotionRedirectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'
import { ONBOARDING_FLOW, type OnboardingStep, type OnboardingStepProps } from '../model/onboardingFlow'

/** 대부분의 스텝엔 필요 없고, 일부 스텝만 공통 props 밖의 값을 쓴다. */
interface StepContext {
  connectionId?: string
  hasConnected: boolean
  /** `ResumeUploadStep`에서 골라 `ResumeProcessingStep`으로 넘기는 업로드 파일. */
  resumeFile: File | null
  setResumeFile: (file: File) => void
}

/** 스텝 → 렌더러 단일 테이블. 모든 스텝을 같은 방식(스텝 props + 공용 컨텍스트)으로 그려 분기를 없앤다. */
const STEP_RENDERERS: Record<OnboardingStep, (props: OnboardingStepProps, ctx: StepContext) => ReactNode> = {
  'has-resume': (props) => <HasResumeStep {...props} />,
  'resume-upload': (props, ctx) => <ResumeUploadStep {...props} onFileReady={ctx.setResumeFile} />,
  'resume-processing': (props, ctx) => <ResumeProcessingStep {...props} file={ctx.resumeFile} />,
  'resume-info': (props) => <ResumeInfoStep {...props} />,
  'notion-connect': (props) => <NotionConnectStep {...props} />,
  'notion-redirecting': () => <NotionRedirectStep />,
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

/**
 * 개발 중 특정 스텝을 바로 확인하기 위한 디버그 진입점.
 * `?debugStep=resume-info`처럼 URL에 붙이면 해당 스텝부터 시작한다(프로덕션에서는 무시).
 * 앞 스텝을 거치지 않고 바로 열기 때문에 "이전" 버튼은 뜨지 않는다.
 */
const useDebugStep = (): OnboardingStep | undefined => {
  const searchParams = useSearchParams()
  if (process.env.NODE_ENV === 'production') return undefined
  const value = searchParams.get('debugStep')
  return value && value in ONBOARDING_FLOW ? (value as OnboardingStep) : undefined
}

const OnboardingFlow = () => {
  const { connectionId } = useNotionReturn('/onboarding')
  const debugStep = useDebugStep()
  const { step, direction, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(connectionId ? 'notion-page-select' : debugStep)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}>
        {STEP_RENDERERS[step](stepProps, { connectionId: connectionId ?? undefined, hasConnected, resumeFile, setResumeFile })}
      </motion.div>
    </AnimatePresence>
  )
}

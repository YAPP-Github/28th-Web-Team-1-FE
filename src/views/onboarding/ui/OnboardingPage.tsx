'use client'
import { Suspense, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNotionReturn } from '@features/notion_connect'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeProcessingStep } from './ResumeProcessingStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionRedirectStep } from './NotionRedirectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { NotionProcessingStep } from './NotionProcessingStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'
import { type OnboardingStep, type OnboardingStepProps } from '../model/onboardingFlow'

/** `NotionPageSelectStep`에서 고른 연결·페이지 목록. `NotionProcessingStep`으로 넘긴다. */
interface NotionSelection {
  connectionId: string
  pageIds: string[]
}

/** 대부분의 스텝엔 필요 없고, 일부 스텝만 공통 props 밖의 값을 쓴다. */
interface StepContext {
  connectionId?: string
  hasConnected: boolean
  /** `ResumeUploadStep`에서 골라 `ResumeProcessingStep`으로 넘기는 업로드 파일. */
  resumeFile: File | null
  setResumeFile: (file: File) => void
  /** `NotionPageSelectStep`에서 골라 `NotionProcessingStep`으로 넘기는 선택 결과. */
  notionSelection: NotionSelection | null
  setNotionSelection: (selection: NotionSelection) => void
}

/** 스텝 → 렌더러 단일 테이블. 모든 스텝을 같은 방식(스텝 props + 공용 컨텍스트)으로 그려 분기를 없앤다. */
const STEP_RENDERERS: Record<OnboardingStep, (props: OnboardingStepProps, ctx: StepContext) => ReactNode> = {
  'has-resume': (props) => <HasResumeStep {...props} />,
  'resume-upload': (props, ctx) => <ResumeUploadStep {...props} onFileReady={ctx.setResumeFile} />,
  'resume-processing': (props, ctx) => <ResumeProcessingStep {...props} file={ctx.resumeFile} />,
  'resume-info': (props) => <ResumeInfoStep {...props} />,
  'notion-connect': (props) => <NotionConnectStep {...props} />,
  'notion-redirecting': () => <NotionRedirectStep />,
  'notion-page-select': (props, ctx) => <NotionPageSelectStep {...props} connectionId={ctx.connectionId} onNotionSelected={ctx.setNotionSelection} />,
  'notion-processing': (props, ctx) => <NotionProcessingStep {...props} connectionId={ctx.notionSelection?.connectionId ?? null} pageIds={ctx.notionSelection?.pageIds ?? []} />,
  complete: (_props, ctx) => <CompleteStep hasConnected={ctx.hasConnected} />
}

export const OnboardingPage = () => (
  <Suspense>
    <OnboardingFlow />
  </Suspense>
)

/** 자체 `Dialog`로 렌더되는 스텝. 모달은 좌우로 슬라이드하는 대신 그 자리에서 페이드로만 뜨고 닫힌다. */
const MODAL_STEPS: ReadonlySet<OnboardingStep> = new Set(['resume-processing', 'notion-redirecting', 'notion-processing'])

interface StepTransitionCustom {
  direction: 1 | -1
  isModal: boolean
}

// 다음(오른쪽→왼쪽) / 이전(왼쪽→오른쪽) 방향에 따라 들어오고 나가는 위치를 반대로 잡는다.
// 모달 스텝은 페이지처럼 슬라이드하면 어색하므로 페이드만 적용한다.
const stepVariants = {
  enter: ({ direction, isModal }: StepTransitionCustom) => (isModal ? { opacity: 0 } : { x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: ({ direction, isModal }: StepTransitionCustom) => (isModal ? { opacity: 0 } : { x: direction > 0 ? -32 : 32, opacity: 0 })
}

const OnboardingFlow = () => {
  const { connectionId, hasError } = useNotionReturn('/onboarding')
  let initialStep: OnboardingStep | undefined
  if (connectionId) initialStep = 'notion-page-select'
  else if (hasError) initialStep = 'notion-connect'
  const { step, direction, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(initialStep)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [notionSelection, setNotionSelection] = useState<NotionSelection | null>(null)

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  return (
    <AnimatePresence mode="wait" custom={{ direction, isModal: MODAL_STEPS.has(step) }} initial={false}>
      <motion.div
        key={step}
        custom={{ direction, isModal: MODAL_STEPS.has(step) }}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
      >
        {STEP_RENDERERS[step](stepProps, { connectionId: connectionId ?? undefined, hasConnected, resumeFile, setResumeFile, notionSelection, setNotionSelection })}
      </motion.div>
    </AnimatePresence>
  )
}

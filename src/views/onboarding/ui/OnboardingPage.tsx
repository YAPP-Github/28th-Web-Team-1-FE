'use client'
import { Suspense, useEffect, type FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { NOTION_CONNECT_ERROR } from '@entities/notion'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { isOnboardingStep } from '../model/onboardingFlow'
import { useOnboardingFlow, type OnboardingStep, type OnboardingStepProps } from '../model/useOnboardingFlow'

const STEP_COMPONENTS: Record<Exclude<OnboardingStep, 'complete' | 'notion-page-select'>, FC<OnboardingStepProps>> = {
  'has-resume': HasResumeStep,
  'resume-upload': ResumeUploadStep,
  'resume-info': ResumeInfoStep,
  'notion-connect': NotionConnectStep
}

/** `useSearchParams`는 정적 프리렌더 시 Suspense 경계를 요구하므로 여기서 감싼다 */
export const OnboardingPage = () => (
  <Suspense>
    <OnboardingFlow />
  </Suspense>
)

const OnboardingFlow = () => {
  // Notion OAuth 콜백이 복귀 URL에 실어 주는 값들: 재진입 스텝(?step=)·연결 ID(?connectionId=)·실패 코드(?error=)
  const searchParams = useSearchParams()
  const stepParam = searchParams.get('step') ?? undefined
  const connectionId = searchParams.get('connectionId') ?? undefined
  const hasConnectError = searchParams.get('error') === NOTION_CONNECT_ERROR

  const { step, next, skip, back, hasPrev, hasSkip, hasConnected } = useOnboardingFlow(isOnboardingStep(stepParam) ? stepParam : undefined)
  const router = useRouter()

  useEffect(() => {
    if (!hasConnectError) return
    toast.error('Notion 연동에 실패했어요. 다시 시도해 주세요.', { id: 'notion-connect-error', position: 'top-center' })
    router.replace('/onboarding') // 새로고침 시 토스트가 반복되지 않도록 ?error= 제거
  }, [hasConnectError, router])

  // 완료 화면만 통일 인터페이스 밖: 온보딩 중 연동 여부에 따라 CTA가 갈린다
  if (step === 'complete') return <CompleteStep hasConnected={hasConnected} />

  const stepProps: OnboardingStepProps = { onDone: next, onPrev: hasPrev ? back : undefined, onSkip: hasSkip ? skip : undefined }

  // 페이지 선택 스텝만 콜백이 넘긴 연결 ID를 추가로 받는다
  if (step === 'notion-page-select') return <NotionPageSelectStep {...stepProps} connectionId={connectionId} />

  const Step = STEP_COMPONENTS[step]
  return <Step {...stepProps} />
}

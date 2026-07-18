'use client'
import { useState } from 'react'
import { cn } from '@shared/lib/cn'
import { HasResumeStep } from './steps/HasResumeStep'
import { ResumeUploadStep } from './steps/ResumeUploadStep'
import { ResumeInfoStep } from './steps/ResumeInfoStep'
import { NotionConnectStep } from './steps/NotionConnectStep'
import { CompleteStep } from './steps/CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'
import { resolveNextStep, type OnboardingAnswers } from '../model/flow'

/**
 * 온보딩 위저드 컨테이너 (route `layout.tsx`의 Scoop 셸 안에서 렌더됨)
 *
 * 현재 스텝(`useOnboardingFlow`)에 따라 스텝 컴포넌트를 렌더하고, 답변 상태를 소유한다.
 * 스텝 컴포넌트는 값/콜백만 받고 네비게이션 방식은 모른다(라우팅 결합도 최소화).
 * 콘텐츠 폭은 스텝3(정보 확인)만 넓고(992px), 나머지는 500px이다.
 *
 * 플로우: 이력서 보유 → (있음) 업로드 → 정보 확인 → 완료 / (없음) 노션 연동 → 완료
 */
export const OnboardingPage = () => {
  const { step, go, back } = useOnboardingFlow()
  const [answers, setAnswers] = useState<OnboardingAnswers>({ hasResume: null, resumeFile: null, hasNotion: null })

  const goNext = () => go(resolveNextStep(step, answers))
  const goComplete = () => go('complete')

  const renderStep = () => {
    switch (step) {
      case 'has-resume':
        return <HasResumeStep value={answers.hasResume} onChange={(hasResume) => setAnswers((prev) => ({ ...prev, hasResume }))} onNext={goNext} />
      case 'resume-upload':
        // 업로드를 건너뛰면 확인할 정보가 없으므로 바로 완료로 보낸다.
        return <ResumeUploadStep file={answers.resumeFile} onChange={(resumeFile) => setAnswers((prev) => ({ ...prev, resumeFile }))} onNext={goNext} onPrev={back} onSkip={goComplete} />
      case 'resume-info':
        return <ResumeInfoStep onNext={goNext} onPrev={back} />
      case 'notion-connect':
        return <NotionConnectStep value={answers.hasNotion} onChange={(hasNotion) => setAnswers((prev) => ({ ...prev, hasNotion }))} onNext={goNext} onPrev={back} onSkip={goNext} />
      case 'complete':
        return <CompleteStep hasResume={Boolean(answers.hasResume)} />
      default:
        return null
    }
  }

  return <div className={cn('flex w-full flex-col gap-10', step === 'resume-info' ? 'max-w-248' : 'max-w-125')}>{renderStep()}</div>
}

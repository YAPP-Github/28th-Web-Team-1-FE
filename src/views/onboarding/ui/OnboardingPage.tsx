'use client'
import { useState } from 'react'
import { OnboardingLayout } from './OnboardingLayout'
import { HasResumeStep } from './steps/HasResumeStep'
import { ResumeUploadStep } from './steps/ResumeUploadStep'
import { NotionConnectStep } from './steps/NotionConnectStep'
import { CompleteStep } from './steps/CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'
import { resolveNextStep, type OnboardingAnswers } from '../model/flow'

/**
 * 온보딩 위저드 컨테이너
 *
 * 현재 스텝(`useOnboardingFlow`)에 따라 스텝 컴포넌트를 렌더하고, 답변 상태를 소유한다.
 * 스텝 컴포넌트는 값/콜백만 받고 네비게이션 방식은 모른다(라우팅 결합도 최소화).
 *
 * 이번 범위: 스텝1(이력서 보유 여부) → 스텝2(파일 업로드) → 완료 화면.
 * 정보 확인/노션 스텝은 `resolveNextStep`의 분기 사이에 이어붙인다.
 */
export const OnboardingPage = () => {
  const { step, go, back } = useOnboardingFlow()
  const [answers, setAnswers] = useState<OnboardingAnswers>({ hasResume: null, resumeFile: null, hasNotion: null })

  const goNext = () => go(resolveNextStep(step, answers))

  const renderStep = () => {
    switch (step) {
      case 'has-resume':
        return <HasResumeStep value={answers.hasResume} onChange={(hasResume) => setAnswers((prev) => ({ ...prev, hasResume }))} onNext={goNext} />
      case 'resume-upload':
        return <ResumeUploadStep file={answers.resumeFile} onChange={(resumeFile) => setAnswers((prev) => ({ ...prev, resumeFile }))} onNext={goNext} onPrev={back} onSkip={goNext} />
      case 'notion-connect':
        return <NotionConnectStep value={answers.hasNotion} onChange={(hasNotion) => setAnswers((prev) => ({ ...prev, hasNotion }))} onNext={goNext} onPrev={back} onSkip={goNext} />
      case 'complete':
        return <CompleteStep hasResume={Boolean(answers.hasResume)} />
      default:
        return null
    }
  }

  return <OnboardingLayout>{renderStep()}</OnboardingLayout>
}

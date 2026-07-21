import { useState } from 'react'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

/** 온보딩 스텝1: 이력서 보유 여부 선택 화면 */
export const HasResumeStep = ({ onDone }: OnboardingStepProps) => {
  const [hasResume, setHasResume] = useState<boolean | null>(null)

  return (
    <OnboardingStepShell
      title="이미 만들어둔 이력서가 있으신가요?"
      description="기본 정보와 경력 사항을 자동으로 불러와 빠르게 이력서를 완성할 수 있어요."
      onNext={() => hasResume !== null && onDone(hasResume)}
      nextDisabled={hasResume === null}
    >
      <OnboardingRadioGroup value={hasResume === null ? undefined : hasResume ? 'yes' : 'no'} onValueChange={(v) => setHasResume(v === 'yes')}>
        <OnboardingRadioItem value="yes">네, 있어요.</OnboardingRadioItem>
        <OnboardingRadioItem value="no">아니오, 없어요.</OnboardingRadioItem>
      </OnboardingRadioGroup>
    </OnboardingStepShell>
  )
}

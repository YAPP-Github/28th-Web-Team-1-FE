import { useState } from 'react'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingChoiceGroup, OnboardingChoiceCard } from './OnboardingChoiceCard'

interface HasResumeStepProps {
  /** 뒤로가기 재진입 시 이전 선택 복원용 시드 */
  defaultValue: boolean | null
  /** "다음" 클릭 시 최종 선택값 보고 */
  onDone: (hasResume: boolean) => void
}

/** 온보딩 스텝1: 이미 만들어둔 이력서 보유 여부 선택 */
export const HasResumeStep = ({ defaultValue, onDone }: HasResumeStepProps) => {
  const [hasResume, setHasResume] = useState(defaultValue)

  return (
    <OnboardingStepShell
      title="이미 만들어둔 이력서가 있으신가요?"
      description="기본 정보와 경력 사항을 자동으로 불러와 빠르게 이력서를 완성할 수 있어요."
      onNext={() => hasResume !== null && onDone(hasResume)}
      nextDisabled={hasResume === null}
    >
      <OnboardingChoiceGroup value={hasResume === null ? undefined : hasResume ? 'yes' : 'no'} onValueChange={(v) => setHasResume(v === 'yes')}>
        <OnboardingChoiceCard value="yes">네, 있어요.</OnboardingChoiceCard>
        <OnboardingChoiceCard value="no">아니오, 없어요.</OnboardingChoiceCard>
      </OnboardingChoiceGroup>
    </OnboardingStepShell>
  )
}

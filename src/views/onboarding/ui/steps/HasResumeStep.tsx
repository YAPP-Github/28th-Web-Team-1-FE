import { OnboardingStepHeader } from '../OnboardingStepHeader'
import { OnboardingChoiceGroup, OnboardingChoiceCard } from '../OnboardingChoiceCard'
import { OnboardingFooter } from '../OnboardingFooter'

interface HasResumeStepProps {
  value: boolean | null
  onChange: (hasResume: boolean) => void
  onNext: () => void
}

/** 온보딩 스텝1: 이미 만들어둔 이력서 보유 여부 선택 */
export const HasResumeStep = ({ value, onChange, onNext }: HasResumeStepProps) => {
  return (
    <>
      <OnboardingStepHeader title="이미 만들어둔 이력서가 있으신가요?" description="기본 정보와 경력 사항을 자동으로 불러와 빠르게 이력서를 완성할 수 있어요." />
      <OnboardingChoiceGroup value={value === null ? undefined : value ? 'yes' : 'no'} onValueChange={(v) => onChange(v === 'yes')}>
        <OnboardingChoiceCard value="yes">네, 있어요.</OnboardingChoiceCard>
        <OnboardingChoiceCard value="no">아니오, 없어요.</OnboardingChoiceCard>
      </OnboardingChoiceGroup>
      <OnboardingFooter onNext={onNext} nextDisabled={value === null} />
    </>
  )
}

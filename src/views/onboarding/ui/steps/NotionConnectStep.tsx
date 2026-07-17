import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { OnboardingStepHeader } from '../OnboardingLayout'
import { OnboardingChoiceGroup, OnboardingChoiceCard } from '../OnboardingChoiceCard'
import { OnboardingFooter } from '../OnboardingFooter'

interface NotionConnectStepProps {
  value: boolean | null
  onChange: (hasNotion: boolean) => void
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

/** 온보딩 스텝: 경험 정리해 둔 Notion 페이지 보유 여부 선택 (이력서 미보유 분기) */
export const NotionConnectStep = ({ value, onChange, onNext, onPrev, onSkip }: NotionConnectStepProps) => {
  return (
    <>
      <OnboardingStepHeader title="경험 정리해 둔 Notion 페이지가 있나요?" description="Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 가공해 드려요." />
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic">
            TIP
          </Chip>
          <Text variant="caption1" color="text-basic">
            이력서로 만들고 싶은 실제 본문 내용이 담긴 하위 페이지를 <span className="text-text-primary-basic">직접 검색</span>해서 선택해 주세요.
          </Text>
        </div>
        <OnboardingChoiceGroup value={value === null ? undefined : value ? 'yes' : 'no'} onValueChange={(v) => onChange(v === 'yes')}>
          <OnboardingChoiceCard value="yes">네, 있어요.</OnboardingChoiceCard>
          <OnboardingChoiceCard value="no">아니오, 없어요.</OnboardingChoiceCard>
        </OnboardingChoiceGroup>
      </div>
      <OnboardingFooter onPrev={onPrev} onNext={onNext} nextDisabled={value === null} onSkip={onSkip} />
    </>
  )
}

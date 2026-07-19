import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

interface NotionConnectStepProps {
  /** 뒤로가기 재진입 시 이전 선택 복원용 시드 */
  defaultValue: boolean | null
  /** "다음" 클릭 시 최종 선택값 보고 */
  onDone: (hasNotion: boolean) => void
  onPrev: () => void
  onSkip: () => void
}

/** 온보딩 스텝: 경험 정리해 둔 Notion 페이지 보유 여부 선택 */
export const NotionConnectStep = ({ defaultValue, onDone, onPrev, onSkip }: NotionConnectStepProps) => {
  const [hasNotion, setHasNotion] = useState(defaultValue)

  return (
    <OnboardingStepShell
      title="경험 정리해 둔 Notion 페이지가 있나요?"
      description="Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 가공해 드려요."
      onNext={() => hasNotion !== null && onDone(hasNotion)}
      nextDisabled={hasNotion === null}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <Flex direction="column" align="center" gap="3" className="w-full">
        <Flex align="center" className="gap-1.5">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic">
            TIP
          </Chip>
          <Text variant="caption1" color="text-basic">
            이력서로 만들고 싶은 실제 본문 내용이 담긴 하위 페이지를 <span className="text-text-primary-basic">직접 검색</span>해서 선택해 주세요.
          </Text>
        </Flex>
        <OnboardingRadioGroup value={hasNotion === null ? undefined : hasNotion ? 'yes' : 'no'} onValueChange={(v) => setHasNotion(v === 'yes')}>
          <OnboardingRadioItem value="yes">네, 있어요.</OnboardingRadioItem>
          <OnboardingRadioItem value="no">아니오, 없어요.</OnboardingRadioItem>
        </OnboardingRadioGroup>
      </Flex>
    </OnboardingStepShell>
  )
}

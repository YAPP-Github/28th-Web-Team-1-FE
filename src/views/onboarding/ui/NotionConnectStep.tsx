import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'

import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

/** 온보딩 스텝: 경험 정리해 둔 Notion 페이지 보유 여부 선택. "있어요"면 다음 스텝(진행 화면)에서 Notion OAuth 동의 화면으로 이탈한다. */
export const NotionConnectStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [hasNotion, setHasNotion] = useState<boolean | null>(null)

  return (
    <OnboardingStepShell
      title="경험 정리해 둔 Notion 페이지가 있나요?"
      description="Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요."
      onNext={() => {
        if (hasNotion === null) return
        onDone(hasNotion)
      }}
      nextDisabled={hasNotion === null}
      nextLabel="다음"
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <Flex direction="column" align="center" gap="5" className="w-full">
        <Flex align="center" className="gap-2">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic text-label1">
            TIP
          </Chip>
          <Text variant="label1" color="text-basic">
            경험이 정리된 <span className="text-text-primary-basic">페이지 명을 직접 검색</span>하면 AI가 더 잘 분석할 수 있어요
          </Text>
        </Flex>
        <OnboardingRadioGroup type="single" value={hasNotion === null ? undefined : hasNotion ? 'yes' : 'no'} onValueChange={(v) => setHasNotion(v === 'yes')}>
          <OnboardingRadioItem value="yes">네, 있어요.</OnboardingRadioItem>
          <OnboardingRadioItem value="no">아니오, 없어요.</OnboardingRadioItem>
        </OnboardingRadioGroup>
      </Flex>
    </OnboardingStepShell>
  )
}

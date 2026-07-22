import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'

import { useWorkspaceId } from '@entities/user'
import { startNotionOAuth } from '@features/notion_connect'

import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

/** 온보딩 스텝: 경험 정리해 둔 Notion 페이지 보유 여부 선택. "있어요"면 Notion OAuth 동의 화면으로 이탈한다. */
export const NotionConnectStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [hasNotion, setHasNotion] = useState<boolean | null>(null)
  const workspaceId = useWorkspaceId()

  return (
    <OnboardingStepShell
      title="경험 정리해 둔 Notion 페이지가 있나요?"
      description="Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 가공해 드려요."
      onNext={() => {
        if (hasNotion === null) return
        if (hasNotion) startNotionOAuth({ workspaceId, returnTo: '/onboarding' })
        else onDone(false)
      }}
      nextDisabled={hasNotion === null}
      nextLabel="다음"
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

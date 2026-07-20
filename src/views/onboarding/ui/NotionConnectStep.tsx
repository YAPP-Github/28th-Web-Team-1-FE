import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { useWorkspaceId } from '@entities/user'
import { NOTION_CALLBACK_PATH, NOTION_OAUTH_NONCE_COOKIE, encodeNotionState, buildNotionAuthorizeUrl } from '@entities/notion'
import type { OnboardingStepProps } from '../model/useOnboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

/** 온보딩 스텝: 경험 정리해 둔 Notion 페이지 보유 여부 선택. "있어요"면 Notion OAuth 동의 화면으로 이탈한다. */
export const NotionConnectStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [hasNotion, setHasNotion] = useState<boolean | null>(null)
  const workspaceId = useWorkspaceId()

  /** 승인 후 콜백(/auth/notion/callback)이 연결을 만들고 페이지 선택 스텝으로 복귀시킨다 */
  const startNotionOAuth = () => {
    const nonce = crypto.randomUUID()
    // 콜백에서 state의 nonce와 대조하는 CSRF 방어용 1회성 쿠키 (10분 내 왕복 전제)
    document.cookie = `${NOTION_OAUTH_NONCE_COOKIE}=${nonce}; path=/; max-age=600; samesite=lax`
    const state = encodeNotionState({ workspaceId, returnTo: '/onboarding', nonce })
    window.location.assign(
      buildNotionAuthorizeUrl({
        clientId: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID ?? '',
        redirectUri: `${window.location.origin}${NOTION_CALLBACK_PATH}`,
        state
      })
    )
  }

  return (
    <OnboardingStepShell
      title="경험 정리해 둔 Notion 페이지가 있나요?"
      description="Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 가공해 드려요."
      onNext={() => {
        if (hasNotion === null) return
        if (hasNotion) startNotionOAuth()
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

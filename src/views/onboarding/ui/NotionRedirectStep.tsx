'use client'
import { useEffect, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Dialog, DialogContent, DialogTitle } from '@shared/ui/dialog'
import { useWorkspaceId } from '@entities/user'
import { startNotionOAuth } from '@features/notion_connect'
import { NotionIcon } from '@shared/icon'
import { Chip } from '@/src/shared/ui/chip'

const REDIRECT_DELAY_MS = 3000
const DOT_INTERVAL_MS = 400

/** 온보딩 스텝: Notion OAuth 동의 화면으로 이탈하기 직전 3초간 보여주는 안내 화면. 마운트 후 3초 뒤 리다이렉트한다. */
export const NotionRedirectStep = () => {
  const workspaceId = useWorkspaceId()
  const [dotCount, setDotCount] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      startNotionOAuth({ workspaceId, returnTo: '/onboarding' })
    }, REDIRECT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [workspaceId])

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => prev % 3)
    }, DOT_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="flex w-150 flex-col items-center gap-6 rounded-2xl py-27.25">
        <Flex direction="column" align="center" gap="5">
          <div className="bg-btn-tertiary-fill flex size-15 items-center justify-center rounded-xl">
            <NotionIcon size={30} />
          </div>
          <DialogTitle>
            <Text variant="heading1" color="text-basic">
              노션 연결하는 중<span className="inline-block w-4.5 text-left">{'.'.repeat(dotCount)}</span>
            </Text>
          </DialogTitle>
        </Flex>
        <Flex align="center" gap="3">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic text-label1">
            TIP
          </Chip>
          <Text variant="headline2" color="text-basic">
            경험이 정리된 <span className="text-text-primary-basic">페이지 명을 직접 검색</span>하면 AI가 더 잘 분석할 수 있어요
          </Text>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

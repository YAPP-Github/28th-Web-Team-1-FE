'use client'
import { useEffect, useRef } from 'react'
import { ProcessingView } from '@shared/ui'
import { Dialog, DialogContent } from '@shared/ui/dialog'
import { useWorkspaceId } from '@entities/user'
import { startNotionOAuth } from '@features/notion_connect'
import type { OnboardingStepProps } from '../model/onboardingFlow'

const STEPS = ['Notion 인증 정보 확인하는 중', 'Notion으로 이동하는 중']

/** 온보딩 스텝: Notion OAuth 동의 화면으로 이탈하기 직전 잠깐 보여주는 진행 화면. 마운트되면 곧바로 리다이렉트한다. */
export const NotionRedirectStep = ({ onPrev }: OnboardingStepProps) => {
  const workspaceId = useWorkspaceId()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    startNotionOAuth({ workspaceId, returnTo: '/onboarding' })
  }, [workspaceId])

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="w-150">
        <ProcessingView
          isComplete={false}
          steps={STEPS}
          title="Notion으로 이동하고 있어요."
          description="잠시만 기다려 주세요"
          successTitle="Notion으로 이동했어요."
          successDescription="잠시 후 인증 화면이 열려요."
          onCancel={onPrev}
        />
      </DialogContent>
    </Dialog>
  )
}

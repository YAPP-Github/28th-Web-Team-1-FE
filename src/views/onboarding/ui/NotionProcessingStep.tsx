'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ProcessingView } from '@shared/ui'
import { Dialog, DialogContent } from '@shared/ui/dialog'
import { useImportNotionExperiences } from '@entities/notion'
import { useWorkspaceId } from '@entities/user'
import type { OnboardingStepProps } from '../model/onboardingFlow'

const STEPS = ['노션 페이지 불러오는 중', '경험만 뽑아내는 중', '거의 다 됐어요!']

interface NotionProcessingStepProps extends OnboardingStepProps {
  /** 이전 스텝(`NotionPageSelectStep`)에서 고른 연결·페이지 목록. */
  connectionId: string | null
  pageIds: string[]
}

/** 온보딩 스텝: 선택한 Notion 페이지를 경험으로 가져오는 동안 보여주는 진행 화면. 완료되면 자동으로 다음 스텝으로 넘어간다. */
export const NotionProcessingStep = ({ connectionId, pageIds, onDone, onPrev }: NotionProcessingStepProps) => {
  const workspaceId = useWorkspaceId()
  const { mutate: importPages, isSuccess } = useImportNotionExperiences(workspaceId)

  useEffect(() => {
    if (!connectionId || pageIds.length === 0) {
      onPrev?.()
      return
    }
    importPages(
      { connectionId, pageIds },
      {
        onSuccess: () => onDone(),
        onError: () => {
          onPrev?.()
          toast.error('경험 가져오기에 실패했어요. 다시 시도해 주세요.', { position: 'top-center' })
        }
      }
    )
  }, [connectionId, pageIds, importPages, onPrev, onDone])

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="w-150">
        <ProcessingView
          isComplete={isSuccess}
          steps={STEPS}
          title="노션 경험을 가져오고 있어요."
          description="잠시만 기다려 주세요"
          successTitle="경험을 모두 가져왔어요!"
          successDescription="정리된 경험을 확인해 보세요."
          onCancel={onPrev}
        />
      </DialogContent>
    </Dialog>
  )
}

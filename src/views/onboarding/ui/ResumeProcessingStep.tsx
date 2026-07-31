'use client'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProcessingView } from '@shared/ui'
import { Dialog, DialogContent } from '@shared/ui/dialog'
import { useCreateProjectFromPdf } from '@entities/project'
import { profileKeys } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { OnboardingStepProps } from '../model/onboardingFlow'

const STEPS = ['이력서 훑어보는 중', '경험 정리하는 중', '보기 좋게 다듬는 중']

interface ResumeProcessingStepProps extends OnboardingStepProps {
  /** 이전 스텝(`ResumeUploadStep`)에서 선택한 파일. */
  file: File | null
}

/** 온보딩 스텝: 업로드한 이력서를 분석해 경험·기본 정보를 추출하는 동안 보여주는 진행 화면. 완료되면 자동으로 다음 스텝으로 넘어간다. */
export const ResumeProcessingStep = ({ file, onDone, onPrev }: ResumeProcessingStepProps) => {
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const { mutate: uploadPdf, isSuccess } = useCreateProjectFromPdf(workspaceId)

  useEffect(() => {
    if (!file) {
      onPrev?.()
      return
    }
    uploadPdf(file, {
      onSuccess: () => {
        onDone?.()
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(workspaceId) })
      },
      onError: () => {
        onPrev?.()
        toast.error('PDF를 업로드하지 못했어요. 다시 시도해 주세요.', { position: 'top-center' })
      }
    })
  }, [file, uploadPdf, queryClient, workspaceId, onPrev, onDone])

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="w-150">
        <ProcessingView
          isComplete={isSuccess}
          steps={STEPS}
          title="이력서를 분석하고 있어요."
          description="잠시만 기다려 주세요"
          successTitle="이력서 분석이 완료됐어요!"
          successDescription="추출된 정보를 확인하고 편집해 보세요."
          onCancel={onPrev}
        />
      </DialogContent>
    </Dialog>
  )
}

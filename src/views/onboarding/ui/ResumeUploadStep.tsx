'use client'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PdfUpload } from '@features/pdf_upload'
import { useCreateProjectFromPdf } from '@entities/project'
import { profileKeys } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'

/**
 * 온보딩 스텝2: 작성해 둔 이력서 파일(pdf)을 업로드한다.
 */
export const ResumeUploadStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [file, setFile] = useState<File | null>(null)
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const { mutateAsync: uploadPdfAsync, isPending } = useCreateProjectFromPdf(workspaceId)

  const handleNext = async () => {
    if (!file) return

    toast.promise(uploadPdfAsync(file), {
      loading: '이력서를 분석하고 있어요...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(workspaceId) })
        onDone()
        return undefined
      },
      error: '요청에 실패했어요. 다시 시도해 주세요.',
      position: 'top-center'
    })
  }

  return (
    <OnboardingStepShell
      title="작성해 둔 이력서 파일을 업로드해주세요."
      description="기존 이력서를 분석해 필요한 정보만 추출하고, JD에 맞게 이력서를 개선할 수 있어요."
      // TODO : handleNext 및 !file || isPending으로 변경 필요
      onNext={handleNext}
      nextDisabled={false}
      nextLabel={isPending ? '분석 중...' : '다음'}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <PdfUpload file={file} onChange={setFile} />
    </OnboardingStepShell>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PdfUpload } from '@features/pdf_upload'
import { useCreateProjectFromPdf } from '@entities/project'
import { profileKeys } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { AMPLITUDE_EVENTS } from '@shared/lib'
import * as amplitude from '@amplitude/unified'

/**
 * 온보딩 스텝2: 작성해 둔 이력서 파일(pdf)을 업로드한다.
 */
export const ResumeUploadStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [file, setFile] = useState<File | null>(null)
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const { mutate: uploadPdf, isPending } = useCreateProjectFromPdf(workspaceId)

  const handleNext = () => {
    if (!file) return

    // 버튼 클릭 시 Amplitude 이벤트 전송(유저 속성 업데이트 포함)
    amplitude.identify(new amplitude.Identify().set('has_resume', true))
    amplitude.track(AMPLITUDE_EVENTS.RESUME_STATUS_SELECTED, { has_resume: true, location: 'onboarding' })

    const toastId = toast.loading('이력서를 분석하고 있어요...', { position: 'top-center' })
    uploadPdf(file, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(workspaceId) })
        toast.dismiss(toastId)
        onDone()
      },
      onError: () => toast.error('요청에 실패했어요. 다시 시도해 주세요.', { id: toastId, position: 'top-center' })
    })
  }
  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.RESUME_UPLOAD_VIEWED)
    amplitude.identify(new amplitude.Identify().set('has_resume', true))
  }, [])

  return (
    <OnboardingStepShell
      title="작성해 둔 이력서 파일을 업로드해주세요."
      description="기존 이력서를 분석해 필요한 정보만 추출하고, JD에 맞게 이력서를 개선할 수 있어요."
      onNext={handleNext}
      nextDisabled={!file || isPending}
      nextLabel={isPending ? '분석 중...' : '다음'}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <PdfUpload file={file} onChange={setFile} />
    </OnboardingStepShell>
  )
}

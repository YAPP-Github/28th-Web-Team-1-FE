'use client'
import { useEffect, useState } from 'react'
import { PdfUpload } from '@features/pdf_upload'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { AMPLITUDE_EVENTS } from '@shared/config'
import * as amplitude from '@amplitude/unified'

interface ResumeUploadStepProps extends OnboardingStepProps {
  /** 선택한 파일을 다음 스텝(분석 진행 화면)에 넘긴다. */
  onFileReady: (file: File) => void
}

/**
 * 온보딩 스텝2: 작성해 둔 이력서 파일(pdf)을 업로드한다.
 * 실제 분석 요청은 다음 스텝(`ResumeProcessingStep`)에서 진행한다.
 */
export const ResumeUploadStep = ({ onDone, onPrev, onSkip, onFileReady }: ResumeUploadStepProps) => {
  const [file, setFile] = useState<File | null>(null)

  const handleNext = () => {
    if (!file) return
    onFileReady(file)
    onDone()
    amplitude.identify(new amplitude.Identify().set('has_resume', true))
    amplitude.track(AMPLITUDE_EVENTS.RESUME_STATUS_SELECTED, { has_resume: true, location: 'onboarding' })

  }
  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.RESUME_UPLOAD_VIEWED)
    amplitude.identify(new amplitude.Identify().set('has_resume', true))
  }, [])

  return (
    <OnboardingStepShell
      title="작성해 둔 이력서 파일을 업로드해주세요."
      description="기존 이력서를 분석해 필요한 정보만 추출하고, 채용공고에 맞춰 개선할 수 있어요."
      onNext={handleNext}
      nextDisabled={!file}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <PdfUpload file={file} onChange={setFile} />
    </OnboardingStepShell>
  )
}

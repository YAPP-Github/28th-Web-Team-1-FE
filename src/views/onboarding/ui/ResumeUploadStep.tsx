import { useState } from 'react'
import { PdfUpload } from '@features/pdf_upload'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'

/** 온보딩 스텝2: 작성해 둔 이력서 파일(pdf) 업로드 */
export const ResumeUploadStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <OnboardingStepShell
      title="작성해 둔 이력서 파일을 업로드해주세요."
      description="기존 이력서를 분석해 필요한 정보만 추출하고, JD에 맞게 이력서를 개선할 수 있어요."
      onNext={() => onDone()}
      nextDisabled={!file}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <PdfUpload file={file} onChange={setFile} />
    </OnboardingStepShell>
  )
}

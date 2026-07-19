'use client'
import { useState } from 'react'
import { HasResumeStep } from './HasResumeStep'
import { ResumeUploadStep } from './ResumeUploadStep'
import { ResumeInfoStep } from './ResumeInfoStep'
import { NotionConnectStep } from './NotionConnectStep'
import { NotionPageSelectStep } from './NotionPageSelectStep'
import { CompleteStep } from './CompleteStep'
import { useOnboardingFlow } from '../model/useOnboardingFlow'

export const OnboardingPage = () => {
  const { step, go, back } = useOnboardingFlow()
  const [hasResume, setHasResume] = useState<boolean | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [hasNotion, setHasNotion] = useState<boolean | null>(null)

  switch (step) {
    case 'has-resume':
      return (
        <HasResumeStep
          value={hasResume}
          onChange={setHasResume}
          onNext={() => {
            if (hasResume !== null) {
              go(hasResume ? 'resume-upload' : 'notion-connect')
            }
          }}
        />
      )
    case 'resume-upload':
      return <ResumeUploadStep file={resumeFile} onChange={setResumeFile} onDone={() => go('resume-info')} onPrev={back} onSkip={() => go('notion-connect')} />
    case 'resume-info':
      return <ResumeInfoStep onDone={() => go('notion-connect')} onPrev={back} />
    case 'notion-connect':
      return (
        <NotionConnectStep
          defaultValue={hasNotion}
          onDone={(answer) => {
            setHasNotion(answer)
            go(answer ? 'notion-page-select' : 'complete')
          }}
          onPrev={back}
          onSkip={() => go('complete')}
        />
      )
    case 'notion-page-select':
      return <NotionPageSelectStep onDone={() => go('complete')} onPrev={back} onSkip={() => go('complete')} />
    case 'complete':
      return <CompleteStep />
    default:
      return null
  }
}

'use client'
import { useEffect, useState } from 'react'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useMeQuery } from '@entities/user'
import * as amplitude from '@amplitude/unified'

/** 온보딩 스텝1: 이력서 보유 여부 선택 화면 */
export const HasResumeStep = ({ onDone }: OnboardingStepProps) => {
  const [hasResume, setHasResume] = useState<boolean | null>(null)
  const { data } = useMeQuery()

  useEffect(() => {
    if (!data?.me.userId) return
    // 온보딩 처음 진입 시 setUserId 레이스 컨디션 방지
    amplitude.setUserId(data.me.userId)
    amplitude.track(AMPLITUDE_EVENTS.RESUME_VIEWED)
  }, [data?.me.userId])

  return (
    <OnboardingStepShell
      title="이미 만들어둔 이력서가 있으신가요?"
      description="이력서를 등록해 두면 기본 정보와 경력을 불러와서, 이력서 초안을 만들 때 활용해요."
      onNext={() => hasResume !== null && onDone(hasResume)}
      nextDisabled={hasResume === null}
    >
      <OnboardingRadioGroup type="single" value={hasResume === null ? undefined : hasResume ? 'yes' : 'no'} onValueChange={(v) => setHasResume(v === 'yes')}>
        <OnboardingRadioItem value="yes">네, 있어요.</OnboardingRadioItem>
        <OnboardingRadioItem value="no">아니오, 없어요.</OnboardingRadioItem>
      </OnboardingRadioGroup>
    </OnboardingStepShell>
  )
}

'use client'
import { useState } from 'react'
import { useMeQuery } from '@entities/user'
import { OptionalConsentDialog, REQUIRED_CONSENTS, SignupConsentDialog } from '@features/consent'
import { SurveyDialog } from '@features/survey_dialog'

// 홈 팝업은 한 세션에 하나만. 우선순위: 가입 동의 시트 > 인터뷰 모집 모달 > 기존 가입자 선택 동의 시트.
export const HomePopups = () => {
  const me = useMeQuery().data?.me
  const hasRequiredConsents = REQUIRED_CONSENTS.every(({ type }) => me?.consents.some((consent) => consent.type === type && consent.agreed))
  const isSignup = me !== undefined && !me.consentSheetRequired && !hasRequiredConsents
  const [hasShownSignup, setHasShownSignup] = useState(false)
  const [isSurveySkipped, setIsSurveySkipped] = useState(false)

  if (isSignup && !hasShownSignup) setHasShownSignup(true)

  if (isSignup) return <SignupConsentDialog />
  if (hasShownSignup) return null

  return (
    <>
      {/** TODO : 설문 종료 후 SurveyDialog 삭제 필요 */}
      <SurveyDialog onSettled={(shown) => setIsSurveySkipped(!shown)} />
      {isSurveySkipped && me?.consentSheetRequired && <OptionalConsentDialog />}
    </>
  )
}

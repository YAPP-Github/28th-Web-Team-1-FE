'use client'
import { useState } from 'react'
import { useMeQuery } from '@entities/user'
import { OptionalConsentDialog, REQUIRED_CONSENTS, SignupConsentDialog } from '@features/consent'
import { SurveyDialog } from '@features/survey_dialog'

const SESSION_KEY = 'home_popup_shown' // 이번 세션에 인터뷰 모달이 떴으면 동의 시트를 띄우지 않기 위한 sessionStorage 키

/**
 * 홈 팝업은 한 세션에 하나만. 우선순위: 가입 동의 시트 > 인터뷰 모집 모달 > 기존 가입자 선택 동의 시트.
 * 가입 후엔 항상 /home으로 오므로 가입 동의 시트도 여기서 띄운다.
 */
export const HomePopups = () => {
  const me = useMeQuery().data?.me
  // 필수 동의가 하나라도 없으면 가입 동의 시트. 기존 가입자(consentSheetRequired)는 선택 동의 시트로 따로 받는다
  const hasRequiredConsents = REQUIRED_CONSENTS.every(({ type }) => me?.consents.some((consent) => consent.type === type && consent.agreed))
  const isSignup = me !== undefined && !me.consentSheetRequired && !hasRequiredConsents
  const [hasShownSignup, setShownSignup] = useState(false)
  const [isSurveyShown, setSurveyShown] = useState<boolean | null>(null)

  // 가입 시트를 저장해 닫은 뒤 같은 방문에서 인터뷰 모달이 이어서 뜨지 않게 기억한다
  if (isSignup && !hasShownSignup) setShownSignup(true)

  const handleSurveySettled = (shown: boolean) => {
    if (shown) sessionStorage.setItem(SESSION_KEY, '1')
    setSurveyShown(shown || sessionStorage.getItem(SESSION_KEY) === '1')
  }

  if (isSignup) return <SignupConsentDialog />
  if (hasShownSignup) return null

  return (
    <>
      {/** TODO : 설문 종료 후 SurveyDialog 삭제 필요 */}
      <SurveyDialog onSettled={handleSurveySettled} />
      {isSurveyShown === false && me?.consentSheetRequired && <OptionalConsentDialog />}
    </>
  )
}

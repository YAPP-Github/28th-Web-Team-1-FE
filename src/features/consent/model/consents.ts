import type { ConsentType } from '@shared/lib/gql/graphql'

const TERMS_URL = 'https://available-snow-c5b.notion.site/3ac0173187fb80b583f4d497f1721bcc?source=copy_link'
const PRIVACY_URL = 'https://available-snow-c5b.notion.site/3ac0173187fb80a3af84fbb6bb20f150?source=copy_link'

interface ConsentInfo {
  title: string
  description: string
  url: string
}

export const CONSENTS: Record<ConsentType, ConsentInfo> = {
  TERMS: { title: '서비스 이용약관', description: '서비스 이용 계약', url: TERMS_URL },
  PRIVACY: { title: '개인정보 수집·이용 (이메일)', description: '로그인, 계정 관리, 서비스 공지', url: PRIVACY_URL },
  RESEARCH: { title: '서비스 개선 리서치 참여 안내', description: '인터뷰·설문·사용성 테스트 참여 요청', url: PRIVACY_URL },
  MARKETING_EMAIL: { title: '광고성 정보 수신 (이메일)', description: '신기능·프로모션·채용 시즌 안내', url: PRIVACY_URL }
}

export const REQUIRED_CONSENTS = ['TERMS', 'PRIVACY'] as const
export const OPTIONAL_CONSENTS = ['RESEARCH', 'MARKETING_EMAIL'] as const
export const MARKETING_RECONFIRM_NOTE = '동의일부터 2년마다 다시 확인해요'

type Consents = ReadonlyArray<{ type: ConsentType; agreed: boolean; changedAt: string }>

export const findConsent = (consents: Consents, type: ConsentType) => consents.find((consent) => consent.type === type)

/** 필수 동의가 하나라도 없으면 가입 동의 시트를 띄워야 한다. */
export const needsSignupConsent = (consents: Consents) => REQUIRED_CONSENTS.some((type) => !findConsent(consents, type)?.agreed)

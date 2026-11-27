import type { AgreeSignupConsentsRequest, ConsentType } from '@shared/lib/gql/graphql'

const TERMS_URL = 'https://available-snow-c5b.notion.site/3ac0173187fb80b583f4d497f1721bcc?source=copy_link'
const PRIVACY_URL = 'https://available-snow-c5b.notion.site/3ac0173187fb80a3af84fbb6bb20f150?source=copy_link'

export type ConsentField = keyof AgreeSignupConsentsRequest

interface Consent {
  type: ConsentType
  field: ConsentField
  isRequired: boolean
  title: string
  description: string
  url: string
}

export const CONSENTS: Consent[] = [
  { type: 'TERMS', field: 'terms', isRequired: true, title: '서비스 이용약관', description: '서비스 이용 계약', url: TERMS_URL },
  { type: 'PRIVACY', field: 'privacy', isRequired: true, title: '개인정보 수집·이용 (이메일)', description: '로그인, 계정 관리, 서비스 공지', url: PRIVACY_URL },
  { type: 'RESEARCH', field: 'research', isRequired: false, title: '서비스 개선 리서치 참여 안내', description: '인터뷰·설문·사용성 테스트 참여 요청', url: PRIVACY_URL },
  {
    type: 'MARKETING_EMAIL',
    field: 'marketingEmail',
    isRequired: false,
    title: '광고성 정보 수신 (이메일)',
    description: '신기능·프로모션·채용 시즌 안내\n동의일부터 2년마다 다시 확인해요',
    url: PRIVACY_URL
  }
]

export const REQUIRED_CONSENTS = CONSENTS.filter((consent) => consent.isRequired)
export const OPTIONAL_CONSENTS = CONSENTS.filter((consent) => !consent.isRequired)

/** 동의 시트 체크 초기값. 선택 항목은 반드시 해제 상태로 시작해야 한다. */
export const INITIAL_CHECKS = Object.fromEntries(CONSENTS.map(({ field }) => [field, false])) as Record<ConsentField, boolean>

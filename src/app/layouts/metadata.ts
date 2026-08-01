import type { Metadata, Viewport } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scoop.me.kr'
const TITLE = '떠먹여주는 이력서, Scoop'
const DESCRIPTION = '한 번의 경험 정리로, 모든 지원을 더 쉽게. 채용공고를 분석해 가장 맞는 경험을 추천해 드려요.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Scoop'
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Scoop',
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6b44ff'
}

/** 검색엔진·AI가 서비스 정체를 이해할 수 있게 루트 레이아웃에 심는 구조화 데이터. */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Scoop',
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'ko'
}

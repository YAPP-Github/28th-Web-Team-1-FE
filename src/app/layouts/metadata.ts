import type { Metadata, Viewport } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scoop.me.kr'
const TITLE = 'SCOOP - 떠먹여 주는 이력서'
const DESCRIPTION = '채용 마감 전, 경쟁력 있는 맞춤 이력서를 5분 만에 만들어 드려요'

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
    type: 'website',
    images: [
      {
        url: '/ogImage.png',
        width: 1200,
        height: 630,
        alt: TITLE
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/ogImage.png']
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

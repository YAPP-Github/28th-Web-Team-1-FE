import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scoop.me.kr'

/**
 * 로그인 이후에만 의미 있는 페이지가 대부분이라 전체를 비공개로 막되,
 * 랜딩(/) · 로그인(/login)만 예외로 연다.
 * '/$'는 '/'로 시작하는 모든 경로가 아니라 루트 경로 자체만 가리킨다(Disallow: /와의 충돌 방지).
 */
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: ['/$', '/login'],
    disallow: '/'
  },
  sitemap: `${SITE_URL}/sitemap.xml`
})

export default robots

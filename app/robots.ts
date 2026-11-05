import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scoop.me.kr'

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: ['/$', '/sitemap.xml'],
    disallow: '/'
  },
  sitemap: `${SITE_URL}/sitemap.xml`
})

export default robots

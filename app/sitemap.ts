import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scoop.me.kr'

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1
  },
  {
    url: `${SITE_URL}/login`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.8
  }
]

export default sitemap

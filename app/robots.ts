import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luania.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/login',
          '/register',
          '/select-tenant',
          '/onboarding',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}

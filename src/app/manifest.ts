import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Meru, Kenya`,
    short_name: 'Eleven Stars',
    description:
      "Eleven Stars FC is Meru's rising Conference League team. Buy tickets, shop merchandise, donate, and follow our journey.",
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    lang: 'en',
    categories: ['sports', 'football', 'soccer'],
    icons: [
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}

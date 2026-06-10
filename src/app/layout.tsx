import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Eleven Stars F.C — Meru, Kenya',
    template: '%s | Eleven Stars F.C',
  },
  description:
    "Eleven Stars FC is Meru's rising Conference League team. Buy tickets, shop merchandise, donate, and follow our journey.",
  keywords: ['Eleven Stars FC', 'Meru soccer', 'Kenya football', 'Conference League Meru'],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Eleven Stars F.C',
    description: "Meru's rising Conference League team.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_KE',
    type: 'website',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Eleven Stars F.C' }],
  },
  twitter: {
    card: 'summary',
    title: 'Eleven Stars F.C — Meru, Kenya',
    description: "Meru's rising Conference League team.",
    images: ['/logo.png'],
  },
  // Search-engine ownership verification (HTML-tag method).
  //  • Google: paste token into GOOGLE_SITE_VERIFICATION (DNS method needs no code).
  //  • Bing: easiest is "Import from Google Search Console" in Bing Webmaster
  //    Tools (no code). Otherwise paste the msvalidate.01 token into
  //    BING_SITE_VERIFICATION.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : {},
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsTeam',
  name: 'Eleven Stars F.C',
  sport: 'Soccer',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  location: {
    '@type': 'Place',
    name: 'Meru, Kenya',
    address: { '@type': 'PostalAddress', addressLocality: 'Meru', addressCountry: 'KE' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-full flex flex-col antialiased font-sans"
        style={{ background: '#0A0A0A' }}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

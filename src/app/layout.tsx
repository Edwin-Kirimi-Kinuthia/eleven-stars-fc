import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Eleven Stars F.C — Meru, Kenya',
    template: '%s | Eleven Stars F.C',
  },
  description:
    "Eleven Stars FC is Meru's rising Conference League team. Buy tickets, shop merchandise, donate, and follow our journey.",
  keywords: ['Eleven Stars FC', 'Meru soccer', 'Kenya football', 'Conference League Meru'],
  openGraph: {
    title: 'Eleven Stars F.C',
    description: "Meru's rising Conference League team.",
    siteName: 'Eleven Stars F.C',
    locale: 'en_KE',
    type: 'website',
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
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

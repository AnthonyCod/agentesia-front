import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://luania.app'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7C3AED',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Luania — Tu tienda vende sola',
    template: '%s | Luania',
  },
  description: 'El primer agente de ventas con IA para tiendas que venden por Instagram y Facebook. Responde clientes, cierra ventas y gestiona pedidos 24/7, sin web, sin código.',
  applicationName: 'Luania',
  authors: [{ name: 'Luania', url: BASE_URL }],
  creator: 'Luania',
  publisher: 'Luania',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: BASE_URL,
    siteName: 'Luania',
    title: 'Luania — Tu tienda vende sola',
    description: 'El primer agente de ventas con IA para tiendas que venden por Instagram y Facebook. Cierra ventas 24/7 automáticamente.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luania — Agente de ventas IA para Instagram y Facebook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luania — Tu tienda vende sola',
    description: 'El primer agente de ventas con IA para tiendas que venden por Instagram y Facebook.',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable} landing-bg`}>
      <body style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

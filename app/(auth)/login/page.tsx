import type { Metadata } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="mb-2">
            <Image src="/images/logo.png" alt="Luania" width={110} height={110} priority />
          </div>
          <p className="mt-0 text-sm" style={{ color: 'var(--color-muted)' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 shadow-sm" style={{ border: '1px solid var(--color-border)' }}>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-muted)' }}>
          © 2026 Luania · Hecho en Lima 🇵🇪
        </p>
      </div>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => window.dispatchEvent(new Event('gsi-loaded'))}
      />
    </div>
  )
}

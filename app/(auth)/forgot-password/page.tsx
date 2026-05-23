import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="mb-2">
            <Image src="/images/logo.png" alt="Luania" width={110} height={110} priority />
          </div>
          <p className="mt-0 text-sm" style={{ color: 'var(--color-muted)' }}>
            Recupera el acceso a tu cuenta
          </p>
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-sm" style={{ border: '1px solid var(--color-border)' }}>
          <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--color-ink)' }}>
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>
            Escríbenos a soporte y te ayudamos a recuperar tu acceso.
          </p>

          <a
            href="mailto:soporte@luania.pe?subject=Recuperar%20contraseña"
            className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Contactar soporte
          </a>

          <p className="mt-5 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            ¿Recuerdas tu contraseña?{' '}
            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}>
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-muted)' }}>
          © 2026 Luania · Hecho en Lima 🇵🇪
        </p>
      </div>
    </div>
  )
}

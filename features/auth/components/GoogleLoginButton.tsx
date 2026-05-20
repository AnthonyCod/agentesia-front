'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void
        }
      }
    }
  }
}

export function GoogleLoginButton() {
  const { googleLogin, isGoogleLoading } = useAuth()
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function init() {
      if (!ref.current || !window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
        callback: async (response: { credential: string }) => {
          setError(null)
          try {
            await googleLogin(response.credential)
          } catch {
            setError('Error al iniciar sesión con Google')
          }
        },
      })
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        width: ref.current.offsetWidth || 320,
        text: 'signin_with',
        locale: 'es',
      })
    }

    if (window.google?.accounts?.id) {
      init()
    } else {
      window.addEventListener('gsi-loaded', init, { once: true })
    }
    return () => window.removeEventListener('gsi-loaded', init)
  }, [])

  return (
    <div className="space-y-2">
      <div ref={ref} className="w-full min-h-[44px]" style={{ opacity: isGoogleLoading ? 0.5 : 1 }} />
      {error && (
        <p className="text-xs font-medium text-center" style={{ color: 'var(--color-primary)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

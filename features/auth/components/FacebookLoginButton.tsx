'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useAuth } from '../hooks/useAuth'

interface FBLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: { accessToken: string; userID: string }
}

export function FacebookLoginButton() {
  const { facebookLogin, isFacebookLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const sdkReady = useRef(false)

  useEffect(() => {
    function init() {
      if (!window.FB || sdkReady.current) return
      sdkReady.current = true
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? '',
        version: 'v19.0',
        cookie: true,
        xfbml: false,
      })
    }

    if (window.FB) {
      init()
    } else {
      window.addEventListener('fb-sdk-loaded', init, { once: true })
    }
    return () => window.removeEventListener('fb-sdk-loaded', init)
  }, [])

  function handleLogin() {
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('El inicio de sesión con Facebook requiere HTTPS.')
      return
    }
    if (!window.FB) {
      setError('SDK de Facebook no cargó. Recarga la página.')
      return
    }
    setError(null)
    window.FB.login((res: FBLoginResponse) => {
      if (res.status !== 'connected' || !res.authResponse) return
      facebookLogin(res.authResponse.accessToken).catch(() => {
        setError('Error al iniciar sesión con Facebook')
      })
    }, { scope: 'email,public_profile' })
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleLogin}
        disabled={isFacebookLoading}
        className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#1877F2', color: '#fff' }}
      >
        {isFacebookLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white flex-shrink-0">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
        Continuar con Facebook
      </button>
      {error && (
        <p className="text-xs font-medium text-center" style={{ color: 'var(--color-primary)' }}>{error}</p>
      )}

      <Script
        src="https://connect.facebook.net/es_LA/sdk.js"
        strategy="afterInteractive"
        onLoad={() => window.dispatchEvent(new Event('fb-sdk-loaded'))}
      />
    </div>
  )
}

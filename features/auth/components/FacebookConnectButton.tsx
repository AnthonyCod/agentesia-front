'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    FB: {
      init: (config: object) => void
      login: (callback: (res: FBLoginResponse) => void, options: { scope: string }) => void
      api: (path: string, params: object, callback: (res: unknown) => void) => void
    }
    fbAsyncInit: () => void
  }
}

interface FBLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: { accessToken: string; userID: string }
}

export interface FacebookPage {
  id: string
  name: string
  access_token: string
}

interface Props {
  onConnect: (page: FacebookPage) => void
}

export function FacebookConnectButton({ onConnect }: Props) {
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState<FacebookPage | null>(null)
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

  function handleConnect() {
    if (!window.FB) {
      setError('SDK de Facebook no cargó. Recarga la página.')
      return
    }
    setError(null)
    setLoading(true)

    window.FB.login((res) => {
      if (res.status !== 'connected' || !res.authResponse) {
        setLoading(false)
        return
      }
      window.FB.api(
        '/me/accounts',
        { fields: 'id,name,access_token', access_token: res.authResponse.accessToken },
        (data: unknown) => {
          setLoading(false)
          const result = data as { data?: FacebookPage[]; error?: { message: string } }
          if (result.error || !result.data?.length) {
            setError('No se encontraron páginas de Facebook en tu cuenta.')
            return
          }
          if (result.data.length === 1) {
            const page = result.data[0]
            setConnected(page)
            onConnect(page)
          } else {
            setPages(result.data)
          }
        }
      )
    }, { scope: 'pages_show_list,pages_messaging,instagram_manage_messages,instagram_basic' })
  }

  function selectPage(page: FacebookPage) {
    setPages([])
    setConnected(page)
    onConnect(page)
  }

  return (
    <>
      <div className="space-y-3">
        {connected ? (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: '#1877F2' }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#1E40AF' }}>Página conectada</p>
              <p className="text-sm font-bold truncate" style={{ color: '#1E3A8A' }}>{connected.name}</p>
            </div>
            <button
              type="button"
              onClick={() => { setConnected(null); setPages([]) }}
              className="text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#3B82F6' }}
            >
              Cambiar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#1877F2', color: '#fff' }}
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white flex-shrink-0">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
            Conectar con Facebook
          </button>
        )}

        {/* Selector de página si hay varias */}
        {pages.length > 1 && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <p className="px-3.5 py-2 text-xs font-semibold" style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-muted)' }}>
              Elige qué página conectar
            </p>
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page)}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-left transition-colors hover:opacity-80"
                style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: '#1877F2' }}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{page.name}</span>
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs font-medium text-center" style={{ color: 'var(--color-primary)' }}>{error}</p>
        )}
      </div>

      <Script
        src="https://connect.facebook.net/es_LA/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('fb-sdk-loaded'))
        }}
      />
    </>
  )
}

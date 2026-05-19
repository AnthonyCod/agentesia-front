'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthResult } from '../types/auth.types'

function setSessionCookies(result: AuthResult | null) {
  if (typeof document === 'undefined') return
  const maxAge = 7 * 24 * 60 * 60
  if (result) {
    document.cookie = `agentesia-token=${result.token}; path=/; max-age=${maxAge}; SameSite=Lax`
    const meta = JSON.stringify({
      hasTenant: !!result.tenant,
      hasMultipleTenants: result.tenants.length > 1,
    })
    document.cookie = `agentesia-auth-meta=${encodeURIComponent(meta)}; path=/; max-age=${maxAge}; SameSite=Lax`
  } else {
    document.cookie = 'agentesia-token=; path=/; max-age=0'
    document.cookie = 'agentesia-auth-meta=; path=/; max-age=0'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenant: null,
      tenants: [],
      isAuthenticated: false,

      setAuth: (result: AuthResult) => {
        setSessionCookies(result)
        set({
          user: result.user,
          token: result.token,
          tenant: result.tenant,
          tenants: result.tenants,
          isAuthenticated: true,
        })
      },

      logout: () => {
        setSessionCookies(null)
        set({ user: null, token: null, tenant: null, tenants: [], isAuthenticated: false })
      },
    }),
    {
      name: 'agentesia-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tenant: state.tenant,
        tenants: state.tenants,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

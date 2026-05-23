import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResult } from '../types/auth.types'
import type { User, TenantInfo } from '../types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  tenant: TenantInfo | null
  tenants: TenantInfo[]
  isAuthenticated: boolean
}

const STORAGE_KEY = 'agentesia-auth'

export function loadAuthState(): Partial<AuthState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<AuthState>
  } catch {
    return {}
  }
}

export function saveAuthState(state: AuthState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      token: state.token,
      tenant: state.tenant,
      tenants: state.tenants,
      isAuthenticated: state.isAuthenticated,
    }))
  } catch { /* ignore */ }
}

function setSessionCookies(result: AuthResult | null): void {
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

const initialState: AuthState = {
  user: null,
  token: null,
  tenant: null,
  tenants: [],
  isAuthenticated: false,
  ...loadAuthState(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthResult>) {
      const result = action.payload
      setSessionCookies(result)
      state.user = result.user
      state.token = result.token
      state.tenant = result.tenant
      state.tenants = result.tenants
      state.isAuthenticated = true
    },
    logout(state) {
      setSessionCookies(null)
      state.user = null
      state.token = null
      state.tenant = null
      state.tenants = []
      state.isAuthenticated = false
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer

'use client'
import { useRouter } from 'next/navigation'
import {
  useLoginMutation,
  useLogoutMutation,
  useSelectTenantMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
} from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, RegisterCredentials, AuthResult } from '../types/auth.types'

function resolveRedirect(result: AuthResult): string {
  if (result.needsOnboarding) return '/onboarding'
  if (result.needsTenantSelection) return '/select-tenant'
  return '/catalog'
}

export function useAuth() {
  const router = useRouter()
  const { setAuth, logout: clearAuth } = useAuthStore()
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation()
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation()
  const [googleLoginMutation, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()
  const [selectTenantMutation, { isLoading: isSelectingTenant }] = useSelectTenantMutation()
  const [logoutMutation] = useLogoutMutation()

  async function login(credentials: LoginCredentials) {
    const result = await loginMutation(credentials).unwrap()
    setAuth(result)
    router.push(resolveRedirect(result))
  }

  async function register(credentials: RegisterCredentials) {
    const result = await registerMutation(credentials).unwrap()
    setAuth(result)
    router.push(resolveRedirect(result))
  }

  async function googleLogin(credential: string) {
    const result = await googleLoginMutation({ credential }).unwrap()
    setAuth(result)
    router.push(resolveRedirect(result))
  }

  async function selectTenant(tenantId: string) {
    const result = await selectTenantMutation({ tenantId }).unwrap()
    setAuth(result)
    router.push('/catalog')
  }

  async function logout() {
    try {
      await logoutMutation().unwrap()
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  return { login, register, googleLogin, logout, selectTenant, isLoginLoading, isRegisterLoading, isGoogleLoading, isSelectingTenant }
}

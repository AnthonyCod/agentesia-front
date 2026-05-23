'use client'
import { useRouter } from 'next/navigation'
import {
  useLoginMutation,
  useLogoutMutation,
  useSelectTenantMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
  useRegisterMutation,
} from '../api/authApi'
import { setAuth, logout as logoutAction } from '../store/authSlice'
import { useAppDispatch } from '@/shared/store/hooks'
import type { LoginCredentials, RegisterCredentials, AuthResult } from '../types/auth.types'

function resolveRedirect(result: AuthResult): string {
  if (result.needsOnboarding) return '/onboarding'
  if (result.needsTenantSelection) return '/select-tenant'
  return '/catalog'
}

export function useAuth() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation()
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation()
  const [googleLoginMutation, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()
  const [facebookLoginMutation, { isLoading: isFacebookLoading }] = useFacebookLoginMutation()
  const [selectTenantMutation, { isLoading: isSelectingTenant }] = useSelectTenantMutation()
  const [logoutMutation] = useLogoutMutation()

  async function login(credentials: LoginCredentials) {
    const result = await loginMutation(credentials).unwrap()
    dispatch(setAuth(result))
    router.push(resolveRedirect(result))
  }

  async function register(credentials: RegisterCredentials) {
    const result = await registerMutation(credentials).unwrap()
    dispatch(setAuth(result))
    router.push(resolveRedirect(result))
  }

  async function googleLogin(credential: string) {
    const result = await googleLoginMutation({ credential }).unwrap()
    dispatch(setAuth(result))
    router.push(resolveRedirect(result))
  }

  async function facebookLogin(accessToken: string) {
    const result = await facebookLoginMutation({ accessToken }).unwrap()
    dispatch(setAuth(result))
    router.push(resolveRedirect(result))
  }

  async function selectTenant(tenantId: string) {
    const result = await selectTenantMutation({ tenantId }).unwrap()
    dispatch(setAuth(result))
    router.push('/catalog')
  }

  async function logout() {
    try {
      await logoutMutation().unwrap()
    } finally {
      dispatch(logoutAction())
      router.push('/login')
    }
  }

  return { login, register, googleLogin, facebookLogin, logout, selectTenant, isLoginLoading, isRegisterLoading, isGoogleLoading, isFacebookLoading, isSelectingTenant }
}

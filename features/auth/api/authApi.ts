import { baseApi } from '@/shared/api/baseApi'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
  SelectTenantDto,
  GoogleLoginDto,
  SetupTenantDto,
} from '../types/auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResult, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResult, RegisterCredentials>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    googleLogin: builder.mutation<AuthResult, GoogleLoginDto>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
    }),
    setupTenant: builder.mutation<AuthResult, SetupTenantDto>({
      query: (body) => ({
        url: '/auth/setup',
        method: 'POST',
        body,
      }),
    }),
    selectTenant: builder.mutation<AuthResult, SelectTenantDto>({
      query: (body) => ({
        url: '/auth/select-tenant',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useSetupTenantMutation,
  useSelectTenantMutation,
  useLogoutMutation,
} = authApi

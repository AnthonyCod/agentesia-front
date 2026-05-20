export interface User {
  id: string
  nombre: string
  email: string
}

export type TenantInfo = {
  id: string
  nombre: string
  ig_page_id: string
  bot_name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface GoogleLoginDto {
  credential: string
}

export interface SetupTenantDto {
  nombreTienda: string
  ig_page_id: string
  access_token: string
  system_prompt: string
  bot_name?: string
}

export interface SelectTenantDto {
  tenantId: string
}

export interface AuthResult {
  token: string
  user: User
  tenant: TenantInfo | null
  tenants: TenantInfo[]
  needsOnboarding: boolean
  needsTenantSelection: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  tenant: TenantInfo | null
  tenants: TenantInfo[]
  isAuthenticated: boolean
  setAuth: (result: AuthResult) => void
  logout: () => void
}

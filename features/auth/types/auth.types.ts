export interface User {
  id: string
  nombre: string
  email: string
}

export type TenantInfo = {
  id: string
  nombre: string
  ig_page_id: string | null
  bot_name: string
  wa_phone_number_id?: string | null
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

export interface FacebookLoginDto {
  accessToken: string
}

export interface SetupTenantDto {
  nombreTienda: string
  system_prompt: string
  bot_name?: string
  ig_page_id?: string
  access_token?: string
  fb_page_id?: string
  fb_access_token?: string
  wa_phone_number_id?: string
  wa_business_account_id?: string
  wa_access_token?: string
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


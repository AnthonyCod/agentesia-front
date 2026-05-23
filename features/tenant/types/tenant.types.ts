export interface Tenant {
  id: string
  nombre: string
  ig_page_id: string | null
  fb_page_id: string | null
  owner_ig_id: string
  system_prompt: string
  bot_name: string
  commission_pct: number
  access_token: string | null
  crm_token: string
  activo: boolean
  created_at: string
  updated_at: string
  wa_phone_number_id: string | null
  wa_business_account_id: string | null
}

export interface UpdateTenantDto {
  nombre?: string
  system_prompt?: string
  bot_name?: string
  ig_page_id?: string
  access_token?: string
  fb_page_id?: string
  wa_phone_number_id?: string
  wa_business_account_id?: string
  wa_access_token?: string
}

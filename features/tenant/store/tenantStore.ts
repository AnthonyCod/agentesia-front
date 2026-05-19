import { create } from 'zustand'
import type { Tenant } from '../types/tenant.types'

interface TenantState {
  activeTenant: Tenant | null
  setActiveTenant: (tenant: Tenant) => void
}

export const useTenantStore = create<TenantState>((set) => ({
  activeTenant: null,
  setActiveTenant: (tenant) => set({ activeTenant: tenant }),
}))

'use client'
import { useAuthStore } from '@/features/auth'
import { useGetTenantByPageIdQuery } from '../api/tenantApi'

export function useTenant() {
  const ig_page_id = useAuthStore((s) => s.tenant?.ig_page_id)
  return useGetTenantByPageIdQuery(ig_page_id!, { skip: !ig_page_id })
}

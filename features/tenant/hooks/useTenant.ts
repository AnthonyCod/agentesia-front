'use client'
import { useAppSelector } from '@/shared/store/hooks'
import { useGetTenantByPageIdQuery } from '../api/tenantApi'

export function useTenant() {
  const ig_page_id = useAppSelector((s) => s.auth.tenant?.ig_page_id)
  return useGetTenantByPageIdQuery(ig_page_id!, { skip: !ig_page_id })
}

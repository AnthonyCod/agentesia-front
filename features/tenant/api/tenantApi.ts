import { baseApi } from '@/shared/api/baseApi'
import type { Tenant, UpdateTenantDto } from '../types/tenant.types'

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantByPageId: builder.query<Tenant, string>({
      query: (ig_page_id) => `/tenants/${ig_page_id}`,
      providesTags: ['Tenant'],
    }),
    updateTenant: builder.mutation<Tenant, { id: string } & UpdateTenantDto>({
      query: ({ id, ...body }) => ({
        url: `/tenants/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tenant'],
    }),
  }),
})

export const { useGetTenantByPageIdQuery, useUpdateTenantMutation } = tenantApi

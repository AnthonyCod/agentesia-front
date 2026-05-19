import { baseApi } from '@/shared/api/baseApi'
import type { Commission } from '../types/commission.types'

export const commissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommissions: builder.query<Commission[], void>({
      query: () => '/orders/commissions/list',
      providesTags: ['Commission'],
    }),
  }),
})

export const { useGetCommissionsQuery } = commissionsApi

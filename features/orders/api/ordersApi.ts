import { baseApi } from '@/shared/api/baseApi'
import type { Order, VerifyOrderResult } from '../types/order.types'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    verifyOrder: builder.mutation<VerifyOrderResult, string>({
      query: (id) => ({ url: `/orders/${id}/verify`, method: 'POST' }),
      invalidatesTags: ['Order'],
    }),
    rejectOrder: builder.mutation<Order, string>({
      query: (id) => ({ url: `/orders/${id}/reject`, method: 'POST' }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useVerifyOrderMutation,
  useRejectOrderMutation,
} = ordersApi

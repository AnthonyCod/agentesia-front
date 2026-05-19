import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useAuthStore } from '@/features/auth/store/authStore'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    prepareHeaders: (headers) => {
      const token = useAuthStore.getState().token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Product', 'Order', 'Tenant', 'Conversation', 'Commission'],
  endpoints: () => ({}),
})

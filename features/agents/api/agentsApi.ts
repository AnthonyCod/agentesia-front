import { baseApi } from '@/shared/api/baseApi'
import type { BotTestRequest, BotTestResponse } from '../types/agent.types'

export const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    testBot: builder.mutation<BotTestResponse, BotTestRequest>({
      query: (body) => ({
        url: '/bot/test',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useTestBotMutation } = agentsApi

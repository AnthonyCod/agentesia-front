import { baseApi } from '@/shared/api/baseApi'
import type { Conversation, ConversationWithMessages } from '../types/conversation.types'

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/conversations',
      providesTags: ['Conversation'],
    }),
    getConversationMessages: builder.query<ConversationWithMessages, string>({
      query: (id) => `/conversations/${id}/messages`,
      providesTags: (_r, _e, id) => [{ type: 'Conversation', id }],
    }),
  }),
})

export const { useGetConversationsQuery, useGetConversationMessagesQuery } = conversationsApi

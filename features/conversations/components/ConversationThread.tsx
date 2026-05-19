'use client'
import { ArrowLeft, Bot, User } from 'lucide-react'
import Link from 'next/link'
import { Spinner } from '@/shared/components/ui/Spinner'
import { Badge } from '@/shared/components/ui/Badge'
import { useGetConversationMessagesQuery } from '../api/conversationsApi'
import { formatDate } from '@/shared/utils/formatters'
import type { Message } from '../types/conversation.types'

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={['flex gap-3', isUser ? 'flex-row' : 'flex-row-reverse'].join(' ')}>
      <div
        className={[
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-600',
        ].join(' ')}
      >
        {isUser ? (
          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div
        className={[
          'max-w-[70%] rounded-2xl px-4 py-2 text-sm',
          isUser
            ? 'rounded-tl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
            : 'rounded-tr-sm bg-blue-600 text-white',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={['mt-1 text-xs', isUser ? 'text-gray-400' : 'text-blue-200'].join(' ')}>
          {formatDate(message.created_at)}
        </p>
      </div>
    </div>
  )
}

export function ConversationThread({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useGetConversationMessagesQuery(conversationId)

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  if (!data) {
    return <p className="text-gray-500 dark:text-gray-400">Conversación no encontrada.</p>
  }

  const { conversation, messages } = data

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/conversations" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {conversation.user_ig_id}
            </h1>
            <Badge variant={conversation.estado === 'activa' ? 'success' : 'default'}>
              {conversation.estado}
            </Badge>
            <Badge variant="info">{conversation.canal}</Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {messages.length} mensajes · Iniciada {formatDate(conversation.created_at)}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">Sin mensajes</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

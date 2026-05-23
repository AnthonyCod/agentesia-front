'use client'
import { ArrowLeft, Bot, User, MessageCircle } from 'lucide-react'
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
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: isUser ? 'var(--color-cream-dark)' : 'var(--color-primary)' }}
      >
        {isUser
          ? <User className="h-4 w-4" style={{ color: 'var(--color-muted)' }} />
          : <Bot  className="h-4 w-4 text-white" />
        }
      </div>
      <div
        className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm"
        style={isUser
          ? { backgroundColor: 'var(--color-cream-dark)', color: 'var(--color-ink)', borderTopLeftRadius: 4 }
          : { backgroundColor: 'var(--color-primary)',    color: '#fff',             borderTopRightRadius: 4 }
        }
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className="mt-1 text-xs opacity-60">{formatDate(message.created_at)}</p>
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
    return <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Conversación no encontrada.</p>
  }

  const { conversation, messages } = data

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/conversations" aria-label="Volver a conversaciones"
          className="icon-btn-hover flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold truncate" style={{ color: 'var(--color-ink)' }}>
              {conversation.user_channel_id}
            </h1>
            <Badge variant={conversation.estado === 'activa' ? 'success' : 'default'}>
              {conversation.estado}
            </Badge>
            <Badge variant="info">{conversation.canal}</Badge>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {messages.length} mensajes · Iniciada {formatDate(conversation.created_at)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-white p-4"
        style={{ borderColor: 'var(--color-border)' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <MessageCircle className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Sin mensajes en esta conversación</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          </div>
        )}
      </div>
    </div>
  )
}

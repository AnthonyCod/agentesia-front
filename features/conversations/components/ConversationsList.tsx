'use client'
import Link from 'next/link'
import { Search, MessageCircle, AtSign, Rss } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useGetConversationsQuery } from '../api/conversationsApi'
import { useConversationsStore } from '../store/conversationsStore'
import { formatDate } from '@/shared/utils/formatters'
import type { Conversation } from '../types/conversation.types'

function CanalIcon({ canal }: { canal: Conversation['canal'] }) {
  if (canal === 'instagram') return <AtSign className="h-4 w-4" style={{ color: '#E1306C' }} />
  return <Rss className="h-4 w-4" style={{ color: '#1877F2' }} />
}

export function ConversationsList() {
  const { data: conversations, isLoading } = useGetConversationsQuery()
  const { search, setSearch } = useConversationsStore()

  const filtered = (conversations ?? []).filter((c) =>
    !search || c.user_ig_id.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            Conversaciones
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {filtered.length} conversación{filtered.length !== 1 ? 'es' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
        <input
          type="text"
          placeholder="Buscar por ID de usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
          style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
        />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16" style={{ color: 'var(--color-muted)' }}>
            <MessageCircle className="h-8 w-8 opacity-40" />
            <p className="text-sm">Sin conversaciones</p>
          </div>
        ) : (
          <div>
            {filtered.map((conv, i) => (
              <Link
                key={conv.id}
                href={`/conversations/${conv.id}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-cream)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '')}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-cream-dark)' }}>
                  <CanalIcon canal={conv.canal} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm" style={{ color: 'var(--color-ink)' }}>
                    {conv.user_ig_id}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {formatDate(conv.updated_at)}
                  </p>
                </div>
                <Badge variant={conv.estado === 'activa' ? 'success' : 'default'}>
                  {conv.estado === 'activa' ? 'Activa' : 'Archivada'}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

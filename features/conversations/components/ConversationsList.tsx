'use client'
import Link from 'next/link'
import { Search, MessageCircle, AtSign, Rss } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useGetConversationsQuery } from '../api/conversationsApi'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { setSearch } from '../store/conversationsSlice'
import type { Conversation } from '../types/conversation.types'
import { useState } from 'react'

const PAGE_SIZE = 20

function CanalIcon({ canal }: { canal: Conversation['canal'] }) {
  if (canal === 'instagram') return <AtSign className="h-4 w-4" style={{ color: '#E1306C' }} />
  if (canal === 'whatsapp') return <MessageCircle className="h-4 w-4" style={{ color: '#25D366' }} />
  return <Rss className="h-4 w-4" style={{ color: '#1877F2' }} />
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'ahora'
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

function isRecent(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 30 * 60 * 1000
}

export function ConversationsList() {
  const { data: conversations, isLoading } = useGetConversationsQuery()
  const dispatch = useAppDispatch()
  const search = useAppSelector((s) => s.conversations.search)
  const [page, setPage] = useState(1)

  const filtered = (conversations ?? []).filter((c) =>
    !search || c.user_channel_id.toLowerCase().includes(search.toLowerCase())
  )
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 skeleton-shimmer rounded-md" />
        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5"
              style={{ borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none' }}>
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
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
          aria-label="Buscar conversaciones por ID de usuario"
          placeholder="Buscar por ID de usuario..."
          value={search}
          onChange={(e) => { dispatch(setSearch(e.target.value)); setPage(1) }}
          className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
          style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
        />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
        {paged.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <MessageCircle className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
              {search ? 'Sin resultados para tu búsqueda' : 'Sin conversaciones aún'}
            </p>
            {!search && (
              <p className="text-xs text-center" style={{ color: 'var(--color-muted)', maxWidth: '18rem' }}>
                Cuando un cliente te escriba por Instagram, Facebook o WhatsApp, la conversación aparecerá aquí.
              </p>
            )}
          </div>
        ) : (
          <div>
            {paged.map((conv, i) => {
              const recent = conv.estado === 'activa' && isRecent(conv.updated_at)
              return (
                <Link
                  key={conv.id}
                  href={`/conversations/${conv.id}`}
                  className="link-row-hover flex items-center gap-4 px-4 py-3.5"
                  style={{ borderBottom: i < paged.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: 'var(--color-cream-dark)' }}>
                      <CanalIcon canal={conv.canal} />
                    </div>
                    {recent && (
                      <span
                        aria-label="Mensaje reciente"
                        className="animate-pulse-dot absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`truncate text-sm ${recent ? 'font-bold' : 'font-semibold'}`}
                        style={{ color: 'var(--color-ink)' }}>
                        {conv.user_channel_id}
                      </p>
                      {recent && (
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {relativeTime(conv.updated_at)}
                    </p>
                  </div>

                  <Badge variant={conv.estado === 'activa' ? 'success' : 'default'}>
                    {conv.estado === 'activa' ? 'Activa' : 'Archivada'}
                  </Badge>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
    </div>
  )
}

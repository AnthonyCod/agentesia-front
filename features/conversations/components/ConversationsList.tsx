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
  if (canal === 'instagram') return <AtSign className="h-4 w-4 text-pink-500" />
  return <Rss className="h-4 w-4 text-blue-600" />
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
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Conversaciones</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} conversaciones</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por ID de usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <MessageCircle className="h-8 w-8" />
            <p className="text-sm">Sin conversaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {filtered.map((conv) => (
              <Link
                key={conv.id}
                href={`/conversations/${conv.id}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <CanalIcon canal={conv.canal} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{conv.user_ig_id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(conv.updated_at)}</p>
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

'use client'
import { Bot } from 'lucide-react'
import { AgentConfigCard, AgentStatsCard, AgentTestChat } from '@/features/agents'

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--color-primary-light)' }}>
          <Bot className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            Agente IA
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-muted)' }}>
            Configura y prueba el bot que atiende a tus clientes en Instagram
          </p>
        </div>
      </div>

      {/* Stats */}
      <AgentStatsCard />

      {/* Config + Test side by side on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AgentConfigCard />
        <AgentTestChat />
      </div>
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, ShoppingCart, Zap } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { Badge } from '@/shared/components/ui/Badge'
import { useAppSelector } from '@/shared/store/hooks'
import { useTestBotMutation } from '../api/agentsApi'
import type { TestMessage } from '../types/agent.types'

function ChatBubble({ msg }: { msg: TestMessage & { order_codigo?: string } }) {
  const isBot = msg.role === 'assistant'
  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: isBot ? 'var(--color-primary-light)' : '#F3F4F6' }}>
        {isBot
          ? <Bot className="h-3.5 w-3.5" style={{ color: 'var(--color-primary)' }} />
          : <User className="h-3.5 w-3.5" style={{ color: 'var(--color-muted)' }} />
        }
      </div>
      <div className="max-w-[75%] space-y-1.5">
        <div
          className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
          style={{
            backgroundColor: isBot ? 'var(--color-surface)' : 'var(--color-primary)',
            color: isBot ? 'var(--color-ink)' : '#fff',
            border: isBot ? '1px solid var(--color-border)' : 'none',
            borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
          }}
        >
          {msg.content}
        </div>
        {msg.order_codigo && (
          <div className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
            style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <ShoppingCart className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#16A34A' }} />
            <span className="text-xs font-semibold" style={{ color: '#15803D' }}>
              Orden generada: {msg.order_codigo}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const QUICK_MESSAGES = [
  '¿Qué productos tienen disponibles?',
  'Quiero comprar algo',
  '¿Cuáles son sus precios?',
]

export function AgentTestChat() {
  const tenant = useAppSelector((s) => s.auth.tenant)
  const [messages, setMessages] = useState<(TestMessage & { order_codigo?: string })[]>([])
  const [input, setInput] = useState('')
  const [testBot, { isLoading }] = useTestBotMutation()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function send(text: string) {
    if (!text.trim() || isLoading) return
    const userMsg = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])

    try {
      const result = await testBot({ message: userMsg }).unwrap()
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: result.reply,
        order_codigo: result.order_codigo,
      }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Error al conectar con el agente. Verifica que tu tienda esté configurada.',
      }])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <Card className="flex flex-col" style={{ height: '520px' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: '#D97706' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
              Probar agente en vivo
            </h2>
          </div>
          {tenant && (
            <Badge variant="default">
              {tenant.bot_name ?? 'Asistente'}
            </Badge>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Simula una conversación real — el bot usará tu catálogo y configuración actual
        </p>
      </CardHeader>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <Bot className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                {tenant?.bot_name ?? 'Tu agente'} está listo
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                Escribe un mensaje para ver cómo responde
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_MESSAGES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-ink)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}>
                  <Bot className="h-3.5 w-3.5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px 18px 18px 18px' }}>
                  <Spinner size="sm" />
                  <span style={{ color: 'var(--color-muted)' }}>Pensando...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje... (Enter para enviar)"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
              maxHeight: '96px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.boxShadow = ''
            }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 96) + 'px'
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all"
            style={{
              backgroundColor: (!input.trim() || isLoading) ? 'var(--color-border)' : 'var(--color-primary)',
              color: '#fff',
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-xs text-center" style={{ color: 'var(--color-muted)' }}>
          Las conversaciones de prueba se guardan en el historial real
        </p>
      </div>
    </Card>
  )
}

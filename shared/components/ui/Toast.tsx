'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const STYLES: Record<ToastVariant, { bg: string; icon: string; border: string }> = {
  success: { bg: '#F0FDF4', icon: '#16A34A', border: '#BBF7D0' },
  error:   { bg: '#FEF2F2', icon: '#C53030', border: '#FECACA' },
  info:    { bg: '#EFF6FF', icon: '#2563EB', border: '#BFDBFE' },
}

let counter = 0

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const Icon = ICONS[toast.variant]
  const s = STYLES[toast.variant]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    const t2 = setTimeout(() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300) }, 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [toast.id, onRemove])

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.875rem 1rem', borderRadius: '0.875rem',
        backgroundColor: s.bg, border: `1px solid ${s.border}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)', maxWidth: '22rem', width: '100%',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      <Icon style={{ color: s.icon, flexShrink: 0, width: 18, height: 18 }} />
      <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#1A1A1A', margin: 0, lineHeight: 1.4 }}>
        {toast.message}
      </p>
      <button onClick={() => onRemove(toast.id)} aria-label="Cerrar notificación"
        style={{ flexShrink: 0, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
        <X style={{ width: 14, height: 14 }} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter
    setToasts((prev) => [...prev.slice(-4), { id, message, variant }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-label="Notificaciones"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          display: 'flex', flexDirection: 'column', gap: '0.625rem', pointerEvents: 'none' }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.toast
}

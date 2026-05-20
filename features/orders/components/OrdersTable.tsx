'use client'
import { Eye, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useOrderFilters } from '../hooks/useOrderFilters'
import { useOrdersStore } from '../store/ordersStore'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order, OrderEstado } from '../types/order.types'

const estadoOptions: { value: OrderEstado | 'all'; label: string }[] = [
  { value: 'all',                   label: 'Todos los estados'      },
  { value: 'pendiente',             label: 'Pendiente'              },
  { value: 'comprobante_recibido',  label: 'Comprobante recibido'   },
  { value: 'verificado',            label: 'Verificado'             },
  { value: 'rechazado',             label: 'Rechazado'              },
  { value: 'archivado',             label: 'Archivado'              },
]

export function OrdersTable() {
  const { data: orders, isLoading, filters, setFilters } = useOrderFilters()
  const { openVoucher } = useOrdersStore()

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          Pedidos
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por código..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
            style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
          />
        </div>
        <select
          value={filters.estado}
          onChange={(e) => setFilters({ estado: e.target.value as OrderEstado | 'all' })}
          className="w-full rounded-lg border py-2.5 px-3.5 text-sm outline-none transition-all sm:w-auto"
          style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          {estadoOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream)' }}>
              {['Código', 'Precio', 'Estado', 'Fecha', ''].map((h, i) => (
                <th key={i} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i === 4 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--color-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
                  Sin pedidos
                </td>
              </tr>
            )}
            {orders.map((order: Order) => (
              <tr key={order.id} className="transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
              >
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {order.codigo}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
                  S/ {order.precio.toFixed(2)}
                </td>
                <td className="px-4 py-3"><OrderStatusBadge estado={order.estado} /></td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>
                  {new Date(order.created_at).toLocaleDateString('es-PE')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => openVoucher(order)} className="h-8 w-8 p-0 rounded-lg" title="Ver comprobante">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

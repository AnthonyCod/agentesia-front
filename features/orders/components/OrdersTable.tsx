'use client'
import { useState } from 'react'
import { Eye, Search, ShoppingCart } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { SkeletonTable } from '@/shared/components/ui/Skeleton'
import { Pagination } from '@/shared/components/ui/Pagination'
import { formatPrice } from '@/shared/utils/formatters'
import { useOrderFilters } from '../hooks/useOrderFilters'
import { useAppDispatch } from '@/shared/store/hooks'
import { openVoucher } from '../store/ordersSlice'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order, OrderEstado } from '../types/order.types'

const PAGE_SIZE = 15

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
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 skeleton-shimmer rounded-md" />
        <SkeletonTable rows={8} cols={5} />
      </div>
    )
  }

  const paged = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
            aria-label="Buscar pedidos por código"
            placeholder="Buscar por código..."
            value={filters.search}
            onChange={(e) => { setFilters({ search: e.target.value }); setPage(1) }}
            className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
            style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
          />
        </div>
        <select
          value={filters.estado}
          onChange={(e) => { setFilters({ estado: e.target.value as OrderEstado | 'all' }); setPage(1) }}
          className="w-full rounded-lg border py-2.5 px-3.5 text-sm outline-none transition-all sm:w-auto"
          style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
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
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ShoppingCart className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                      {filters.search || filters.estado !== 'all' ? 'Sin pedidos con ese filtro' : 'Sin pedidos aún'}
                    </p>
                    {!filters.search && filters.estado === 'all' && (
                      <p className="text-xs text-center" style={{ color: 'var(--color-muted)', maxWidth: '18rem' }}>
                        Cuando tus clientes hagan pedidos por Instagram aparecerán aquí.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {paged.map((order: Order) => (
              <tr key={order.id} className="table-row-hover"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {order.codigo}
                </td>
                <td className="px-4 py-3 font-semibold tabular" style={{ color: 'var(--color-ink)' }}>
                  {formatPrice(order.precio)}
                </td>
                <td className="px-4 py-3"><OrderStatusBadge estado={order.estado} /></td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>
                  {new Date(order.created_at).toLocaleDateString('es-PE')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => dispatch(openVoucher(order))} aria-label="Ver comprobante"
                      className="h-8 w-8 p-0 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={orders.length} onPage={setPage} />
    </div>
  )
}

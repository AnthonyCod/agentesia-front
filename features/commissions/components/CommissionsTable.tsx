'use client'
import { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { SkeletonTable } from '@/shared/components/ui/Skeleton'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useGetCommissionsQuery } from '../api/commissionsApi'
import { formatDate } from '@/shared/utils/formatters'
import type { CommissionEstado } from '../types/commission.types'

const PAGE_SIZE = 15

const estadoOptions: { value: CommissionEstado | 'all'; label: string }[] = [
  { value: 'all',             label: 'Todas'              },
  { value: 'pendiente_cobro', label: 'Pendiente de cobro' },
  { value: 'cobrado',         label: 'Cobrado'            },
]

export function CommissionsTable() {
  const { data: commissions, isLoading } = useGetCommissionsQuery()
  const [filterEstado, setFilterEstado] = useState<CommissionEstado | 'all'>('all')
  const [page, setPage] = useState(1)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 skeleton-shimmer rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 skeleton-shimmer rounded-xl" />
          <div className="h-20 skeleton-shimmer rounded-xl" />
        </div>
        <SkeletonTable rows={6} cols={4} />
      </div>
    )
  }

  const all      = commissions ?? []
  const filtered = filterEstado === 'all' ? all : all.filter((c) => c.estado === filterEstado)
  const paged    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalPendiente = all.filter((c) => c.estado === 'pendiente_cobro').reduce((s, c) => s + c.monto, 0)
  const totalCobrado   = all.filter((c) => c.estado === 'cobrado').reduce((s, c) => s + c.monto, 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          Comisiones
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {all.length} comisión{all.length !== 1 ? 'es' : ''} en total
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4" style={{ color: '#D97706' }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#92400E' }}>
              Pendiente de cobro
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#78350F' }}>
            S/ {totalPendiente.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4" style={{ color: '#16A34A' }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#14532D' }}>
              Total cobrado
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#166534' }}>
            S/ {totalCobrado.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <select
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value as CommissionEstado | 'all'); setPage(1) }}
          className="rounded-lg border py-2.5 px-3.5 text-sm outline-none transition-all"
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
              {['Orden ID', 'Monto', 'Estado', 'Fecha'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <DollarSign className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                      Sin comisiones
                    </p>
                    <p className="text-xs text-center" style={{ color: 'var(--color-muted)', maxWidth: '18rem' }}>
                      Las comisiones aparecen cuando se verifican pedidos en tu plan Básico.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((commission) => (
                <tr key={commission.id} className="table-row-hover"
                  style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
                    {commission.order_id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 font-semibold tabular" style={{ color: 'var(--color-ink)' }}>
                    S/ {commission.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={commission.estado === 'cobrado' ? 'success' : 'warning'}>
                      {commission.estado === 'cobrado' ? 'Cobrado' : 'Pendiente'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>
                    {formatDate(commission.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
    </div>
  )
}

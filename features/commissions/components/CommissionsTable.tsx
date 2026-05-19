'use client'
import { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useGetCommissionsQuery } from '../api/commissionsApi'
import { formatDate } from '@/shared/utils/formatters'
import type { CommissionEstado } from '../types/commission.types'

const estadoOptions: { value: CommissionEstado | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pendiente_cobro', label: 'Pendiente de cobro' },
  { value: 'cobrado', label: 'Cobrado' },
]

export function CommissionsTable() {
  const { data: commissions, isLoading } = useGetCommissionsQuery()
  const [filterEstado, setFilterEstado] = useState<CommissionEstado | 'all'>('all')

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  const all = commissions ?? []
  const filtered = filterEstado === 'all' ? all : all.filter((c) => c.estado === filterEstado)
  const totalPendiente = all
    .filter((c) => c.estado === 'pendiente_cobro')
    .reduce((s, c) => s + c.monto, 0)
  const totalCobrado = all
    .filter((c) => c.estado === 'cobrado')
    .reduce((s, c) => s + c.monto, 0)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Comisiones</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pendiente de cobro
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            S/ {totalPendiente.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Total cobrado
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-800 dark:text-green-200">
            S/ {totalCobrado.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value as CommissionEstado | 'all')}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {estadoOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Orden ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Monto
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Estado
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Sin comisiones
                </td>
              </tr>
            ) : (
              filtered.map((commission) => (
                <tr key={commission.id}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {commission.order_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    S/ {commission.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={commission.estado === 'cobrado' ? 'success' : 'warning'}>
                      {commission.estado === 'cobrado' ? 'Cobrado' : 'Pendiente'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(commission.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

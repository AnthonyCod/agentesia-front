'use client'
import { Eye } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useOrderFilters } from '../hooks/useOrderFilters'
import { useOrdersStore } from '../store/ordersStore'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order, OrderEstado } from '../types/order.types'

const estadoOptions: { value: OrderEstado | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'comprobante_recibido', label: 'Comprobante recibido' },
  { value: 'verificado', label: 'Verificado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'archivado', label: 'Archivado' },
]

export function OrdersTable() {
  const { data: orders, isLoading, filters, setFilters } = useOrderFilters()
  const { openVoucher } = useOrdersStore()

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Pedidos</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Buscar por código..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <select
          value={filters.estado}
          onChange={(e) => setFilters({ estado: e.target.value as OrderEstado | 'all' })}
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
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Código</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Precio</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Fecha</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Comprobante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Sin pedidos
                </td>
              </tr>
            )}
            {orders.map((order: Order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">
                  {order.codigo}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  S/ {order.precio.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge estado={order.estado} />
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('es-PE')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => openVoucher(order)}
                      className="px-2 py-1"
                      title="Ver comprobante"
                    >
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

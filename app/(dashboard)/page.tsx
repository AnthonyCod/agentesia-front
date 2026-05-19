'use client'
import { ShoppingCart, CheckCircle, Clock, DollarSign, MessageCircle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useGetOrdersQuery } from '@/features/orders/api/ordersApi'
import { useGetCommissionsQuery } from '@/features/commissions/api/commissionsApi'
import { useGetConversationsQuery } from '@/features/conversations/api/conversationsApi'
import { useGetProductsQuery } from '@/features/catalog/api/catalogApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatDate } from '@/shared/utils/formatters'

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const tenant = useAuthStore((s) => s.tenant)
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery()
  const { data: commissions, isLoading: loadingCommissions } = useGetCommissionsQuery()
  const { data: conversations, isLoading: loadingConversations } = useGetConversationsQuery()
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery()

  const isLoading = loadingOrders || loadingCommissions || loadingConversations || loadingProducts

  if (isLoading) {
    return <div className="flex justify-center p-16"><Spinner size="lg" /></div>
  }

  const allOrders = orders ?? []
  const pendientes = allOrders.filter((o) => o.estado === 'pendiente').length
  const porVerificar = allOrders.filter((o) => o.estado === 'comprobante_recibido').length
  const verificados = allOrders.filter((o) => o.estado === 'verificado').length
  const totalVentas = allOrders
    .filter((o) => o.estado === 'verificado')
    .reduce((s, o) => s + o.precio, 0)

  const comisionesPendientes = (commissions ?? [])
    .filter((c) => c.estado === 'pendiente_cobro')
    .reduce((s, c) => s + c.monto, 0)

  const conversacionesActivas = (conversations ?? []).filter((c) => c.estado === 'activa').length
  const totalProductos = (products ?? []).length

  const ultimasOrdenes = allOrders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido{tenant ? `, ${tenant.nombre}` : ''}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de tu tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Pedidos totales"
          value={allOrders.length}
          icon={ShoppingCart}
          color="bg-blue-600"
        />
        <StatCard
          title="Por verificar"
          value={porVerificar}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Verificados"
          value={verificados}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Comisión pendiente"
          value={`S/ ${comisionesPendientes.toFixed(2)}`}
          icon={DollarSign}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Conversaciones activas"
          value={conversacionesActivas}
          icon={MessageCircle}
          color="bg-pink-500"
        />
        <StatCard
          title="Productos en catálogo"
          value={totalProductos}
          icon={Package}
          color="bg-indigo-600"
        />
      </div>

      {/* Últimos pedidos */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Últimos pedidos</h2>
        </CardHeader>
        <CardContent>
          {ultimasOrdenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {ultimasOrdenes.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      {order.codigo}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      S/ {order.precio.toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        order.estado === 'verificado'
                          ? 'success'
                          : order.estado === 'rechazado'
                          ? 'danger'
                          : order.estado === 'comprobante_recibido'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {order.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen ventas */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Resumen financiero</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total ventas verificadas</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                S/ {totalVentas.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pedidos pendientes</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{pendientes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

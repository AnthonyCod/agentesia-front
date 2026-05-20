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

const STAT_COLORS: Record<string, string> = {
  blue:   'var(--color-primary)',
  yellow: '#D97706',
  green:  '#16A34A',
  purple: '#7C3AED',
  pink:   '#DB2777',
  indigo: '#4F46E5',
}

function StatCard({ title, value, icon: Icon, colorKey }: {
  title: string
  value: string | number
  icon: React.ElementType
  colorKey: string
}) {
  const color = STAT_COLORS[colorKey] ?? 'var(--color-primary)'
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold leading-none" style={{ color: 'var(--color-ink)' }}>
              {value}
            </p>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: color + '18' }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const tenant = useAuthStore((s) => s.tenant)
  const { data: orders,        isLoading: loadingOrders }        = useGetOrdersQuery()
  const { data: commissions,   isLoading: loadingCommissions }   = useGetCommissionsQuery()
  const { data: conversations, isLoading: loadingConversations } = useGetConversationsQuery()
  const { data: products,      isLoading: loadingProducts }      = useGetProductsQuery()

  const isLoading = loadingOrders || loadingCommissions || loadingConversations || loadingProducts

  if (isLoading) {
    return (
      <div className="flex justify-center p-16">
        <Spinner size="lg" />
      </div>
    )
  }

  const allOrders            = orders ?? []
  const pendientes           = allOrders.filter((o) => o.estado === 'pendiente').length
  const porVerificar         = allOrders.filter((o) => o.estado === 'comprobante_recibido').length
  const verificados          = allOrders.filter((o) => o.estado === 'verificado').length
  const totalVentas          = allOrders.filter((o) => o.estado === 'verificado').reduce((s, o) => s + o.precio, 0)
  const comisionesPendientes = (commissions ?? []).filter((c) => c.estado === 'pendiente_cobro').reduce((s, c) => s + c.monto, 0)
  const conversacionesActivas = (conversations ?? []).filter((c) => c.estado === 'activa').length
  const totalProductos       = (products ?? []).length
  const ultimasOrdenes       = allOrders.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          {tenant ? `Hola, ${tenant.nombre} 👋` : 'Panel principal'}
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--color-muted)' }}>
          Resumen de tu tienda hoy
        </p>
      </div>

      {/* Stats 4-col */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pedidos totales"    value={allOrders.length}                      icon={ShoppingCart} colorKey="blue"   />
        <StatCard title="Por verificar"      value={porVerificar}                          icon={Clock}        colorKey="yellow" />
        <StatCard title="Verificados"        value={verificados}                           icon={CheckCircle}  colorKey="green"  />
        <StatCard title="Comisión pendiente" value={`S/ ${comisionesPendientes.toFixed(2)}`} icon={DollarSign} colorKey="purple" />
      </div>

      {/* Stats 2-col */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard title="Conversaciones activas" value={conversacionesActivas} icon={MessageCircle} colorKey="pink"   />
        <StatCard title="Productos en catálogo"  value={totalProductos}        icon={Package}       colorKey="indigo" />
      </div>

      {/* Últimos pedidos */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
            Últimos pedidos
          </h2>
        </CardHeader>
        <CardContent>
          {ultimasOrdenes.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Sin pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {ultimasOrdenes.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                      {order.codigo}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                      S/ {order.precio.toFixed(2)}
                    </span>
                    <Badge variant={
                      order.estado === 'verificado'           ? 'success'  :
                      order.estado === 'rechazado'            ? 'danger'   :
                      order.estado === 'comprobante_recibido' ? 'warning'  : 'default'
                    }>
                      {order.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen financiero */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
            Resumen financiero
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                Total ventas verificadas
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                S/ {totalVentas.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                Pedidos pendientes
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                {pendientes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

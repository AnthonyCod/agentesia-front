'use client'
import { ShoppingCart, CheckCircle, Clock, DollarSign, MessageCircle, Package, TrendingUp, AlertCircle, Inbox } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { SkeletonStatGrid, SkeletonCard } from '@/shared/components/ui/Skeleton'
import { useGetOrdersQuery } from '@/features/orders/api/ordersApi'
import { useGetCommissionsQuery } from '@/features/commissions/api/commissionsApi'
import { useGetConversationsQuery } from '@/features/conversations/api/conversationsApi'
import { useGetProductsQuery } from '@/features/catalog/api/catalogApi'
import { useAppSelector } from '@/shared/store/hooks'
import { formatDate, formatPrice } from '@/shared/utils/formatters'

const STAT_COLORS: Record<string, string> = {
  blue:   'var(--color-primary)',
  yellow: '#D97706',
  green:  '#16A34A',
  purple: '#7C3AED',
  pink:   '#DB2777',
  indigo: '#4F46E5',
}

function StatCard({ title, value, icon: Icon, colorKey, context, href }: {
  title: string
  value: string | number
  icon: React.ElementType
  colorKey: string
  context?: { label: string; tone: 'warning' | 'success' | 'neutral' }
  href?: string
}) {
  const color = STAT_COLORS[colorKey] ?? 'var(--color-primary)'
  const toneColor = context?.tone === 'warning' ? '#D97706' : context?.tone === 'success' ? '#16A34A' : 'var(--color-muted)'
  const inner = (
    <CardContent className="pt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold leading-none tabular" style={{ color: 'var(--color-ink)' }}>
            {value}
          </p>
          {context && (
            <p className="mt-1.5 text-xs font-medium" style={{ color: toneColor }}>
              {context.label}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '18' }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </CardContent>
  )
  return href ? (
    <Link href={href} className="block press-scale rounded-xl">
      <Card>{inner}</Card>
    </Link>
  ) : (
    <Card>{inner}</Card>
  )
}

export default function DashboardPage() {
  const tenant = useAppSelector((s) => s.auth.tenant)
  const { data: orders,        isLoading: loadingOrders }        = useGetOrdersQuery()
  const { data: commissions,   isLoading: loadingCommissions }   = useGetCommissionsQuery()
  const { data: conversations, isLoading: loadingConversations } = useGetConversationsQuery()
  const { data: products,      isLoading: loadingProducts }      = useGetProductsQuery()

  const isLoading = loadingOrders || loadingCommissions || loadingConversations || loadingProducts

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-56 skeleton-shimmer rounded-md" />
          <div className="h-4 w-36 skeleton-shimmer rounded-md" />
        </div>
        <SkeletonStatGrid count={4} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-28 skeleton-shimmer rounded-xl" />
          <div className="h-28 skeleton-shimmer rounded-xl" />
        </div>
        <SkeletonCard rows={4} />
        <SkeletonCard rows={2} />
      </div>
    )
  }

  const allOrders             = orders ?? []
  const pendientes            = allOrders.filter((o) => o.estado === 'pendiente').length
  const porVerificar          = allOrders.filter((o) => o.estado === 'comprobante_recibido').length
  const verificados           = allOrders.filter((o) => o.estado === 'verificado').length
  const totalVentas           = allOrders.filter((o) => o.estado === 'verificado').reduce((s, o) => s + o.precio, 0)
  const comisionesPendientes  = (commissions ?? []).filter((c) => c.estado === 'pendiente_cobro').reduce((s, c) => s + c.monto, 0)
  const comisionesPendCount   = (commissions ?? []).filter((c) => c.estado === 'pendiente_cobro').length
  const conversacionesActivas = (conversations ?? []).filter((c) => c.estado === 'activa').length
  const totalProductos        = (products ?? []).length
  const stockBajo             = (products ?? []).filter((p) => p.stock <= 5).length
  const ultimasOrdenes        = allOrders.slice(0, 5)

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
        <StatCard
          title="Pedidos totales"
          value={allOrders.length}
          icon={ShoppingCart}
          colorKey="blue"
          href="/orders"
          context={pendientes > 0
            ? { label: `${pendientes} sin comprobante`, tone: 'warning' }
            : { label: 'Todo al día', tone: 'success' }}
        />
        <StatCard
          title="Por verificar"
          value={porVerificar}
          icon={Clock}
          colorKey="yellow"
          href="/orders"
          context={porVerificar > 0
            ? { label: 'Requieren acción', tone: 'warning' }
            : { label: 'Sin pendientes', tone: 'success' }}
        />
        <StatCard
          title="Verificados"
          value={verificados}
          icon={CheckCircle}
          colorKey="green"
          href="/orders"
          context={{ label: `${formatPrice(totalVentas)} en ventas`, tone: 'success' }}
        />
        <StatCard
          title="Comisión pendiente"
          value={formatPrice(comisionesPendientes)}
          icon={DollarSign}
          colorKey="purple"
          href="/commissions"
          context={comisionesPendCount > 0
            ? { label: `${comisionesPendCount} cobro${comisionesPendCount !== 1 ? 's' : ''} pendiente${comisionesPendCount !== 1 ? 's' : ''}`, tone: 'warning' }
            : { label: 'Sin cobros pendientes', tone: 'neutral' }}
        />
      </div>

      {/* Stats 2-col */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Conversaciones activas"
          value={conversacionesActivas}
          icon={MessageCircle}
          colorKey="pink"
          href="/conversations"
          context={{ label: `${(conversations ?? []).length} totales`, tone: 'neutral' }}
        />
        <StatCard
          title="Productos en catálogo"
          value={totalProductos}
          icon={Package}
          colorKey="indigo"
          href="/catalog"
          context={stockBajo > 0
            ? { label: `${stockBajo} con stock bajo (≤5)`, tone: 'warning' }
            : { label: 'Stock normal', tone: 'success' }}
        />
      </div>

      {/* Alertas de acción */}
      {(porVerificar > 0 || stockBajo > 0) && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#92400E' }}>Tienes acciones pendientes</p>
            <ul className="mt-1 text-xs space-y-0.5" style={{ color: '#B45309' }}>
              {porVerificar > 0 && (
                <li>• <Link href="/orders" className="underline underline-offset-2">{porVerificar} pedido{porVerificar !== 1 ? 's' : ''} con comprobante esperando verificación</Link></li>
              )}
              {stockBajo > 0 && (
                <li>• <Link href="/catalog" className="underline underline-offset-2">{stockBajo} producto{stockBajo !== 1 ? 's' : ''} con stock bajo (≤5 unidades)</Link></li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Últimos pedidos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
              Últimos pedidos
            </h2>
            <Link href="/orders" className="text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}>
              Ver todos →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {ultimasOrdenes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Inbox className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Sin pedidos aún</p>
              <p className="text-xs text-center" style={{ color: 'var(--color-muted)', maxWidth: '18rem' }}>
                Cuando tus clientes hagan pedidos por Instagram, aparecerán aquí.
              </p>
            </div>
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
                      {formatPrice(order.precio)}
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
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: '#16A34A' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
              Resumen financiero
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                Total ventas verificadas
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                {formatPrice(totalVentas)}
              </p>
              <p className="mt-1 text-xs" style={{ color: '#16A34A' }}>{verificados} pedido{verificados !== 1 ? 's' : ''} verificado{verificados !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                Pedidos pendientes
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                {pendientes}
              </p>
              <p className="mt-1 text-xs" style={{ color: pendientes > 0 ? '#D97706' : 'var(--color-muted)' }}>
                {pendientes > 0 ? 'Esperando comprobante' : 'Sin pendientes'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

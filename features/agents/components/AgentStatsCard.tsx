'use client'
import { MessageCircle, ShoppingCart, CheckCircle, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useGetConversationsQuery } from '@/features/conversations/api/conversationsApi'
import { useGetOrdersQuery } from '@/features/orders/api/ordersApi'

function Stat({ label, value, icon: Icon, color }: {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: color + '18' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold leading-none" style={{ color: 'var(--color-ink)' }}>{value}</p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--color-muted)' }}>{label}</p>
      </div>
    </div>
  )
}

export function AgentStatsCard() {
  const { data: conversations, isLoading: loadingConvs } = useGetConversationsQuery()
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery()

  const isLoading = loadingConvs || loadingOrders

  const totalConvs    = (conversations ?? []).length
  const activeConvs   = (conversations ?? []).filter((c) => c.estado === 'activa').length
  const totalOrders   = (orders ?? []).length
  const verifiedOrders = (orders ?? []).filter((o) => o.estado === 'verificado').length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
            Rendimiento del agente
          </h2>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Actividad generada automáticamente por el bot de IA
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Spinner size="sm" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Conversaciones totales"  value={totalConvs}    icon={MessageCircle} color="#DB2777" />
            <Stat label="Conversaciones activas"  value={activeConvs}   icon={Activity}      color="#7C3AED" />
            <Stat label="Pedidos generados"       value={totalOrders}   icon={ShoppingCart}  color="var(--color-primary)" />
            <Stat label="Pedidos verificados"     value={verifiedOrders} icon={CheckCircle}  color="#16A34A" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

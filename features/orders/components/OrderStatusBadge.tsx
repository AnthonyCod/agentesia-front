import { Badge } from '@/shared/components/ui/Badge'
import type { BadgeVariant } from '@/shared/components/ui/Badge'
import type { OrderEstado } from '../types/order.types'

const estadoConfig: Record<OrderEstado, { label: string; variant: BadgeVariant }> = {
  pendiente: { label: 'Pendiente', variant: 'warning' },
  comprobante_recibido: { label: 'Comprobante recibido', variant: 'info' },
  verificado: { label: 'Verificado', variant: 'success' },
  rechazado: { label: 'Rechazado', variant: 'danger' },
  archivado: { label: 'Archivado', variant: 'default' },
}

export function OrderStatusBadge({ estado }: { estado: OrderEstado }) {
  const { label, variant } = estadoConfig[estado]
  return <Badge variant={variant}>{label}</Badge>
}

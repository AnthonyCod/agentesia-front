export type OrderEstado =
  | 'pendiente'
  | 'comprobante_recibido'
  | 'verificado'
  | 'rechazado'
  | 'archivado'

export interface Order {
  id: string
  tenant_id: string
  conversation_id: string
  product_id: string
  codigo: string
  estado: OrderEstado
  precio: number
  comprobante_url: string | null
  comprobante_validado_ia: boolean
  created_at: string
  updated_at: string
}

export interface Commission {
  id: string
  order_id: string
  tenant_id: string
  monto: number
  estado: 'pendiente_cobro' | 'cobrado'
  created_at: string
}

export interface VerifyOrderResult {
  order: Order
  commission: Commission
}

export interface OrderFilters {
  search: string
  estado: OrderEstado | 'all'
}

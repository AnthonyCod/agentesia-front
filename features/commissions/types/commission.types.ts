export type CommissionEstado = 'pendiente_cobro' | 'cobrado'

export interface Commission {
  id: string
  order_id: string
  tenant_id: string
  monto: number
  estado: CommissionEstado
  created_at: string
}

export interface CommissionFilters {
  estado: CommissionEstado | 'all'
}

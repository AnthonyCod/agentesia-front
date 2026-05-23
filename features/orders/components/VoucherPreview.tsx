'use client'
import Image from 'next/image'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { OrderStatusBadge } from './OrderStatusBadge'
import { useToast } from '@/shared/components/ui/Toast'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { closeVoucher } from '../store/ordersSlice'
import { useVerifyOrderMutation, useRejectOrderMutation } from '../api/ordersApi'

export function VoucherPreview() {
  const dispatch = useAppDispatch()
  const isVoucherOpen = useAppSelector((s) => s.orders.isVoucherOpen)
  const selectedOrder = useAppSelector((s) => s.orders.selectedOrder)
  const [verifyOrder, { isLoading: isVerifying }] = useVerifyOrderMutation()
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation()
  const toast = useToast()

  if (!isVoucherOpen || !selectedOrder) return null

  const canActOnOrder = selectedOrder.estado === 'comprobante_recibido'

  async function handleVerify() {
    try {
      await verifyOrder(selectedOrder!.id).unwrap()
      toast('Pago verificado correctamente', 'success')
      dispatch(closeVoucher())
    } catch {
      toast('No se pudo verificar el pago', 'error')
    }
  }

  async function handleReject() {
    try {
      await rejectOrder(selectedOrder!.id).unwrap()
      toast('Pedido rechazado', 'info')
      dispatch(closeVoucher())
    } catch {
      toast('No se pudo rechazar el pedido', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-scale-in"
        style={{ border: '1px solid var(--color-border)' }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
              Pedido {selectedOrder.codigo}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <OrderStatusBadge estado={selectedOrder.estado} />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                S/ {selectedOrder.precio.toFixed(2)}
              </span>
            </div>
          </div>
          <button onClick={() => dispatch(closeVoucher())} aria-label="Cerrar" className="icon-btn-hover rounded-lg p-1.5"
            style={{ color: 'var(--color-muted)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {selectedOrder.comprobante_url ? (
          <div className="relative mb-4 h-72 w-full overflow-hidden rounded-xl"
            style={{ backgroundColor: 'var(--color-cream)' }}>
            <Image src={selectedOrder.comprobante_url} alt="Comprobante de pago" fill className="object-contain" />
          </div>
        ) : (
          <div className="mb-4 flex h-32 flex-col items-center justify-center gap-2 rounded-xl"
            style={{ backgroundColor: 'var(--color-cream)', border: '1px dashed var(--color-border)' }}>
            <span style={{ fontSize: '1.5rem' }}>🧾</span>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Sin comprobante adjunto</p>
          </div>
        )}

        {canActOnOrder && (
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleReject} loading={isRejecting} className="flex-1 py-2.5 rounded-xl">
              <XCircle className="h-4 w-4" /> Rechazar
            </Button>
            <Button variant="primary" onClick={handleVerify} loading={isVerifying} className="flex-1 py-2.5 rounded-xl">
              <CheckCircle className="h-4 w-4" /> Verificar pago
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

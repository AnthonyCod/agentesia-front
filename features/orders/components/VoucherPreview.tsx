'use client'
import Image from 'next/image'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { OrderStatusBadge } from './OrderStatusBadge'
import { useOrdersStore } from '../store/ordersStore'
import { useVerifyOrderMutation, useRejectOrderMutation } from '../api/ordersApi'

export function VoucherPreview() {
  const { isVoucherOpen, selectedOrder, closeVoucher } = useOrdersStore()
  const [verifyOrder, { isLoading: isVerifying }] = useVerifyOrderMutation()
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation()

  if (!isVoucherOpen || !selectedOrder) return null

  const canActOnOrder = selectedOrder.estado === 'comprobante_recibido'

  async function handleVerify() {
    try {
      await verifyOrder(selectedOrder!.id).unwrap()
      closeVoucher()
    } catch { /* errors handled by RTK */ }
  }

  async function handleReject() {
    try {
      await rejectOrder(selectedOrder!.id).unwrap()
      closeVoucher()
    } catch { /* errors handled by RTK */ }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pedido {selectedOrder.codigo}
            </h2>
            <div className="mt-1">
              <OrderStatusBadge estado={selectedOrder.estado} />
            </div>
          </div>
          <button
            onClick={closeVoucher}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Precio:</span> S/ {selectedOrder.precio.toFixed(2)}
        </div>

        {selectedOrder.comprobante_url ? (
          <div className="relative mb-4 h-72 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={selectedOrder.comprobante_url}
              alt="Comprobante de pago"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-400">Sin comprobante adjunto</p>
          </div>
        )}

        {canActOnOrder && (
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleReject}
              loading={isRejecting}
              className="flex-1"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </Button>
            <Button
              variant="primary"
              onClick={handleVerify}
              loading={isVerifying}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4" />
              Verificar pago
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

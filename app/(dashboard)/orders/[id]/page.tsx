'use client'
import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge'
import { useGetOrderQuery, useVerifyOrderMutation, useRejectOrderMutation } from '@/features/orders/api/ordersApi'
import { formatDate } from '@/shared/utils/formatters'
import { useRouter } from 'next/navigation'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: order, isLoading } = useGetOrderQuery(id)
  const [verifyOrder, { isLoading: isVerifying }] = useVerifyOrderMutation()
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation()

  if (isLoading) {
    return <div className="flex justify-center p-16"><Spinner size="lg" /></div>
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver a pedidos
        </Link>
        <p className="text-gray-500 dark:text-gray-400">Pedido no encontrado.</p>
      </div>
    )
  }

  const canAct = order.estado === 'comprobante_recibido'

  async function handleVerify() {
    await verifyOrder(order!.id).unwrap()
    router.push('/orders')
  }

  async function handleReject() {
    await rejectOrder(order!.id).unwrap()
    router.push('/orders')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{order.codigo}</h1>
        <OrderStatusBadge estado={order.estado} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">Precio</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              S/ {order.precio.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(order.created_at)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Detalles</h2>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Validado por IA</dt>
              <dd>
                <Badge variant={order.comprobante_validado_ia ? 'success' : 'default'}>
                  {order.comprobante_validado_ia ? 'Sí' : 'No'}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Producto ID</dt>
              <dd className="font-mono text-xs text-gray-600 dark:text-gray-300">{order.product_id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Última actualización</dt>
              <dd className="text-gray-700 dark:text-gray-300">{formatDate(order.updated_at)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Comprobante de pago</h2>
        </CardHeader>
        <CardContent>
          {order.comprobante_url ? (
            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={order.comprobante_url}
                alt="Comprobante de pago"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-400">Sin comprobante adjunto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {canAct && (
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
  )
}

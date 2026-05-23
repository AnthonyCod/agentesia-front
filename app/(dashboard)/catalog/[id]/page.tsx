'use client'
import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useGetProductQuery } from '@/features/catalog/api/catalogApi'
import { useAppDispatch } from '@/shared/store/hooks'
import { openForm } from '@/features/catalog/store/catalogSlice'
import { ProductForm } from '@/features/catalog/components/ProductForm'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: product, isLoading } = useGetProductQuery(id)
  const dispatch = useAppDispatch()

  if (isLoading) {
    return <div className="flex justify-center p-16"><Spinner size="lg" /></div>
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Link href="/catalog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
        <p className="text-gray-500 dark:text-gray-400">Producto no encontrado.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </Link>
          <Button variant="secondary" onClick={() => dispatch(openForm(product))}>
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.nombre}</h1>
          {product.descripcion && (
            <p className="mt-2 text-gray-500 dark:text-gray-400">{product.descripcion}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">Precio</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                S/ {product.precio.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.stock}</p>
                <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                  {product.stock > 0 ? 'Disponible' : 'Sin stock'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {product.atributos && Object.keys(product.atributos).length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Atributos</h2>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {Object.entries(product.atributos).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="capitalize text-gray-500 dark:text-gray-400">{key}</dt>
                    <dd className="text-gray-900 dark:text-white">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
      <ProductForm />
    </>
  )
}

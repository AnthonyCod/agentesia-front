import { Card, CardContent } from '@/shared/components/ui/Card'
import type { Product } from '../types/catalog.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{product.nombre}</h3>
          <span className="shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400">
            S/ {product.precio.toFixed(2)}
          </span>
        </div>
        {product.descripcion && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.descripcion}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Stock: {product.stock}</p>
      </CardContent>
    </Card>
  )
}

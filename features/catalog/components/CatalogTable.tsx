'use client'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import { useCatalogStore } from '../store/catalogStore'
import { useDeleteProductMutation } from '../api/catalogApi'
import type { Product } from '../types/catalog.types'

export function CatalogTable() {
  const { data: products, isLoading, filters, setFilters } = useCatalogFilters()
  const { openForm } = useCatalogStore()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Catálogo</h1>
        <Button onClick={() => openForm()} variant="primary">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Descripción</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Precio</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Stock</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Sin productos
                </td>
              </tr>
            )}
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.nombre}</td>
                <td className="max-w-xs truncate px-4 py-3 text-gray-500 dark:text-gray-400">
                  {product.descripcion ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  S/ {product.precio.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => openForm(product)} className="px-2 py-1">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteProduct(product.id)}
                      loading={isDeleting}
                      className="px-2 py-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

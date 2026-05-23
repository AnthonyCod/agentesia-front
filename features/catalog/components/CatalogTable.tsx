'use client'
import { useState } from 'react'
import { Pencil, Trash2, Plus, Search, Package } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { SkeletonTable } from '@/shared/components/ui/Skeleton'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useToast } from '@/shared/components/ui/Toast'
import { formatPrice } from '@/shared/utils/formatters'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import { useAppDispatch } from '@/shared/store/hooks'
import { openForm } from '../store/catalogSlice'
import { useDeleteProductMutation } from '../api/catalogApi'
import type { Product } from '../types/catalog.types'

const PAGE_SIZE = 10

export function CatalogTable() {
  const { data: products, isLoading, filters, setFilters } = useCatalogFilters()
  const dispatch = useAppDispatch()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const toast = useToast()
  const [page, setPage] = useState(1)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-28 skeleton-shimmer rounded-md" />
        <SkeletonTable rows={6} cols={5} />
      </div>
    )
  }

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleDelete(product: Product) {
    try {
      await deleteProduct(product.id).unwrap()
      toast(`"${product.nombre}" eliminado`, 'info')
      if (paged.length === 1 && page > 1) setPage(page - 1)
    } catch {
      toast('No se pudo eliminar el producto', 'error')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            Catálogo
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => dispatch(openForm())} variant="primary">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
        <input
          type="text"
          aria-label="Buscar productos"
          placeholder="Buscar por nombre o descripción..."
          value={filters.search}
          onChange={(e) => { setFilters({ search: e.target.value }); setPage(1) }}
          className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
          style={{ borderColor: 'var(--color-border)', backgroundColor: '#fff', color: 'var(--color-ink)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream)' }}>
              {['Nombre', 'Descripción', 'Precio', 'Stock', 'Acciones'].map((h, i) => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i === 4 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--color-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="h-10 w-10 opacity-20" style={{ color: 'var(--color-ink)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                      {filters.search ? 'Sin resultados para tu búsqueda' : 'Sin productos aún'}
                    </p>
                    {!filters.search && (
                      <Button variant="primary" onClick={() => dispatch(openForm())} className="mt-1">
                        <Plus className="h-4 w-4" /> Agregar primer producto
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {paged.map((product: Product) => (
              <tr key={product.id} className="table-row-hover"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {product.nombre}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>
                  {product.descripcion ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold tabular" style={{ color: 'var(--color-ink)' }}>
                  {formatPrice(product.precio)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: product.stock === 0 ? '#FEE2E2' : product.stock <= 5 ? '#FEF9C3' : '#DCFCE7',
                      color:           product.stock === 0 ? '#991B1B' : product.stock <= 5 ? '#854D0E' : '#15803D',
                    }}>
                    {product.stock === 0 ? 'Sin stock' : `${product.stock} uds`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" onClick={() => dispatch(openForm(product))} aria-label="Editar producto"
                      className="h-8 w-8 p-0 rounded-lg">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product)} loading={isDeleting}
                      aria-label="Eliminar producto" className="h-8 w-8 p-0 rounded-lg">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={products.length} onPage={setPage} />
    </div>
  )
}

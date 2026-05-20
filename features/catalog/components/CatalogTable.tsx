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
        <Button onClick={() => openForm()} variant="primary">
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
          placeholder="Buscar por nombre o descripción..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: '#fff',
            color: 'var(--color-ink)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = '' }}
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
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
                  Sin productos aún — crea el primero
                </td>
              </tr>
            )}
            {products.map((product: Product) => (
              <tr key={product.id} className="transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {product.nombre}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-sm" style={{ color: 'var(--color-muted)' }}>
                  {product.descripcion ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
                  S/ {product.precio.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: product.stock <= 5 ? '#FEF9C3' : '#DCFCE7',
                      color: product.stock <= 5 ? '#854D0E' : '#15803D',
                    }}>
                    {product.stock} uds
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" onClick={() => openForm(product)} className="h-8 w-8 p-0 rounded-lg">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="danger" onClick={() => deleteProduct(product.id)} loading={isDeleting} className="h-8 w-8 p-0 rounded-lg">
                      <Trash2 className="h-3.5 w-3.5" />
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

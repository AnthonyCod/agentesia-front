'use client'
import { useMemo } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useCatalogStore } from '../store/catalogStore'
import { useGetProductsQuery } from '../api/catalogApi'

export function useCatalogFilters() {
  const { filters, setFilters } = useCatalogStore()
  const debouncedSearch = useDebounce(filters.search, 350)
  const query = useGetProductsQuery()

  const filteredProducts = useMemo(() => {
    if (!query.data) return []
    if (!debouncedSearch) return query.data
    const lower = debouncedSearch.toLowerCase()
    return query.data.filter(
      (p) =>
        p.nombre.toLowerCase().includes(lower) ||
        (p.descripcion ?? '').toLowerCase().includes(lower),
    )
  }, [query.data, debouncedSearch])

  return { filters, setFilters, ...query, data: filteredProducts }
}

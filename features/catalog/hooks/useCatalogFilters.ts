'use client'
import { useMemo } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { setFilters } from '../store/catalogSlice'
import { useGetProductsQuery } from '../api/catalogApi'

export function useCatalogFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.catalog.filters)
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

  return {
    filters,
    setFilters: (f: Parameters<typeof setFilters>[0]) => dispatch(setFilters(f)),
    ...query,
    data: filteredProducts,
  }
}

'use client'
import { useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { setFilters } from '../store/ordersSlice'
import { useGetOrdersQuery } from '../api/ordersApi'

export function useOrderFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.orders.filters)
  const query = useGetOrdersQuery()

  const filteredOrders = useMemo(() => {
    if (!query.data) return []
    return query.data.filter((order) => {
      const matchesEstado = filters.estado === 'all' || order.estado === filters.estado
      const matchesSearch =
        !filters.search ||
        order.codigo.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.id.toLowerCase().includes(filters.search.toLowerCase())
      return matchesEstado && matchesSearch
    })
  }, [query.data, filters])

  return {
    filters,
    setFilters: (f: Parameters<typeof setFilters>[0]) => dispatch(setFilters(f)),
    ...query,
    data: filteredOrders,
  }
}

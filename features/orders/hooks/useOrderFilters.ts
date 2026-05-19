'use client'
import { useMemo } from 'react'
import { useOrdersStore } from '../store/ordersStore'
import { useGetOrdersQuery } from '../api/ordersApi'

export function useOrderFilters() {
  const { filters, setFilters } = useOrdersStore()
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

  return { filters, setFilters, ...query, data: filteredOrders }
}

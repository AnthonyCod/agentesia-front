import { create } from 'zustand'
import type { Order, OrderFilters } from '../types/order.types'

interface OrdersState {
  filters: OrderFilters
  selectedOrder: Order | null
  isVoucherOpen: boolean
  setFilters: (filters: Partial<OrderFilters>) => void
  openVoucher: (order: Order) => void
  closeVoucher: () => void
}

export const useOrdersStore = create<OrdersState>((set) => ({
  filters: { search: '', estado: 'all' },
  selectedOrder: null,
  isVoucherOpen: false,
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  openVoucher: (order) => set({ selectedOrder: order, isVoucherOpen: true }),
  closeVoucher: () => set({ selectedOrder: null, isVoucherOpen: false }),
}))

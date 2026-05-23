import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Order, OrderFilters } from '../types/order.types'

interface OrdersState {
  filters: OrderFilters
  selectedOrder: Order | null
  isVoucherOpen: boolean
}

const initialState: OrdersState = {
  filters: { search: '', estado: 'all' },
  selectedOrder: null,
  isVoucherOpen: false,
}

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<OrderFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    openVoucher(state, action: PayloadAction<Order>) {
      state.selectedOrder = action.payload
      state.isVoucherOpen = true
    },
    closeVoucher(state) {
      state.selectedOrder = null
      state.isVoucherOpen = false
    },
  },
})

export const { setFilters, openVoucher, closeVoucher } = ordersSlice.actions
export default ordersSlice.reducer

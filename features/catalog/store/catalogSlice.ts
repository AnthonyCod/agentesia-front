import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, CatalogFilters } from '../types/catalog.types'

interface CatalogState {
  filters: CatalogFilters
  selectedProduct: Product | null
  isFormOpen: boolean
}

const initialState: CatalogState = {
  filters: { search: '' },
  selectedProduct: null,
  isFormOpen: false,
}

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<CatalogFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    openForm(state, action: PayloadAction<Product | undefined>) {
      state.selectedProduct = action.payload ?? null
      state.isFormOpen = true
    },
    closeForm(state) {
      state.selectedProduct = null
      state.isFormOpen = false
    },
  },
})

export const { setFilters, openForm, closeForm } = catalogSlice.actions
export default catalogSlice.reducer

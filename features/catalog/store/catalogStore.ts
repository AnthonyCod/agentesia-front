import { create } from 'zustand'
import type { Product, CatalogFilters } from '../types/catalog.types'

interface CatalogState {
  filters: CatalogFilters
  selectedProduct: Product | null
  isFormOpen: boolean
  setFilters: (filters: Partial<CatalogFilters>) => void
  openForm: (product?: Product) => void
  closeForm: () => void
}

export const useCatalogStore = create<CatalogState>((set) => ({
  filters: { search: '' },
  selectedProduct: null,
  isFormOpen: false,
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  openForm: (product) => set({ selectedProduct: product ?? null, isFormOpen: true }),
  closeForm: () => set({ selectedProduct: null, isFormOpen: false }),
}))

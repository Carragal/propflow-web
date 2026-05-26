import { create } from 'zustand'
import type { PropertyFilters, OperationType, PropertyType } from '@/types/property'

interface SearchState {
  filters: PropertyFilters
  operation: OperationType
  query: string
  setOperation: (op: OperationType) => void
  setQuery: (q: string) => void
  setFilters: (filters: Partial<PropertyFilters>) => void
  resetFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {},
  operation: '' as OperationType,
  query: '',
  setOperation: (operation) => set({ operation }),
  setQuery: (query) => set({ query }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: {}, query: '' }),
}))

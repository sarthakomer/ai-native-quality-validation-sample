import { create } from 'zustand';
import type { SearchFilters } from '../types';

interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
}

const initialFilters: SearchFilters = {
  city: '',
  country: '',
  propertyType: '',
  minPrice: undefined,
  maxPrice: undefined,
  guests: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  amenities: [],
  checkIn: undefined,
  checkOut: undefined,
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: initialFilters,

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  clearFilters: () => set({ filters: initialFilters }),
}));

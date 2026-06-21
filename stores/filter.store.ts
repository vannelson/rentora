import { create } from 'zustand';
import type { CarFilters } from '../types';

interface FilterState {
  filters: CarFilters;
  setFilters: (filters: Partial<CarFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: CarFilters = {};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

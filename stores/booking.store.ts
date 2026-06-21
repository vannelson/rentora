import { create } from 'zustand';
import type { Car } from '../types';

interface BookingDraft {
  car: Car | null;
  startDate: string | null;
  endDate: string | null;
  pickupLocation: string;
  addOns: string[];
}

interface BookingState {
  draft: BookingDraft;
  setDraftCar: (car: Car) => void;
  setDraftDates: (start: string, end: string) => void;
  setPickupLocation: (location: string) => void;
  toggleAddOn: (addOnId: string) => void;
  resetDraft: () => void;
}

const defaultDraft: BookingDraft = {
  car: null,
  startDate: null,
  endDate: null,
  pickupLocation: '',
  addOns: [],
};

export const useBookingStore = create<BookingState>((set) => ({
  draft: defaultDraft,
  setDraftCar: (car) => set((s) => ({ draft: { ...s.draft, car } })),
  setDraftDates: (startDate, endDate) =>
    set((s) => ({ draft: { ...s.draft, startDate, endDate } })),
  setPickupLocation: (pickupLocation) =>
    set((s) => ({ draft: { ...s.draft, pickupLocation } })),
  toggleAddOn: (addOnId) =>
    set((s) => ({
      draft: {
        ...s.draft,
        addOns: s.draft.addOns.includes(addOnId)
          ? s.draft.addOns.filter((id) => id !== addOnId)
          : [...s.draft.addOns, addOnId],
      },
    })),
  resetDraft: () => set({ draft: defaultDraft }),
}));

import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  profile: User | null;
  isLoading: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setProfile: (profile: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  profile: null,
  isLoading: false,
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ isLoggedIn: false, profile: null, isLoading: false }),
}));

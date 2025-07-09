import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (val) => set({ isAuthenticated: val }),
}));
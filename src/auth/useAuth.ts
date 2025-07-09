// src/auth/useAuth.ts
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  setAuthenticated: (val: boolean) => void;
  setLoading: (val: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: true,
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setLoading: (val) => set({ loading: val }),
}));

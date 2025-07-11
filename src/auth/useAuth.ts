import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  requiresProfileCompletion: boolean;
  setAuthenticated: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setRequiresProfileCompletion: (val: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: true,
  requiresProfileCompletion: false,
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setLoading: (val) => set({ loading: val }),
  setRequiresProfileCompletion: (val) =>
    set({ requiresProfileCompletion: val }),
}));

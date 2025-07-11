import { create } from "zustand";

interface UserState {
  name: string;
  email: string;
  setUser: (name: string, email: string) => void;
}

export const useUser = create<UserState>((set) => ({
  name: "",
  email: "",
  setUser: (name, email) => set({ name, email }),
}));

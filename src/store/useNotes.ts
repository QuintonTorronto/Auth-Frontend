import { create } from "zustand";
import axios from "axios";
import api from "../api/axios";
import { toast } from "react-toastify";

interface Note {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (content: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotes = create<NotesState>((set) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/notes");
      set({ notes: res.data });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch notes");
        set({ error: err.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  addNote: async (content) => {
    try {
      const res = await api.post("/notes", { content });
      set((state) => ({ notes: [res.data, ...state.notes] }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to add note");
      }
    }
  },

  updateNote: async (id, content) => {
    try {
      const res = await api.patch(`/notes/${id}`, { content });
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? res.data : n)),
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update note");
      }
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete note");
      }
    }
  },
}));

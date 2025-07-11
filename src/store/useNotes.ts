import { create } from "zustand";
import api from "../api/axios";
import type { Note } from "../types/note";
import { toast } from "react-toastify";
import axios from "axios";

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
      const res = await api.get<Note[]>("/notes");
      set({ notes: res.data });
    } catch (err) {
      const error = err as axios.AxiosError;
      toast.error(error.response?.data?.message || "Failed to fetch notes");
      set({ error: error.message || "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  addNote: async (content: string) => {
    try {
      const res = await api.post<Note>("/notes", { content });
      set((state) => ({ notes: [res.data, ...state.notes] }));
    } catch (err) {
      const error = err as axios.AxiosError;
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  },

  updateNote: async (id: string, content: string) => {
    try {
      const res = await api.patch<Note>(`/notes/${id}`, { content });
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? res.data : n)),
      }));
    } catch (err) {
      const error = err as axios.AxiosError;
      toast.error(error.response?.data?.message || "Failed to update note");
    }
  },

  deleteNote: async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
      }));
    } catch (err) {
      const error = err as axios.AxiosError;
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  },
}));

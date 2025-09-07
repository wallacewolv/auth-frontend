import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  signup: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post<{ user: User }>(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as any;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
}));

import { create } from 'zustand';
import type { User } from '@fitness-tracker/shared';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // State
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    error: null 
  }),
})); 
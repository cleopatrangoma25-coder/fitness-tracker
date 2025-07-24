import { create } from 'zustand';
import type { User } from '@fitness-tracker/shared';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setProfile: (profile: User | null) => void;
  updateProfile: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  // State
  profile: null,
  isLoading: false,
  error: null,

  // Actions
  setProfile: (profile) => set({ profile, error: null }),
  
  updateProfile: (updates) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...updates } : null
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 
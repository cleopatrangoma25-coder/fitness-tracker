import { create } from 'zustand';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatar?: string;
  height: number;
  weight: number;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  bio?: string;
  joinDate: string;
  totalWorkouts: number;
  achievements: number;
  currentStreak: number;
  preferences: {
    units: 'metric' | 'imperial';
    notifications: {
      workoutReminders: boolean;
      goalUpdates: boolean;
      achievements: boolean;
      weeklyReports: boolean;
    };
  };
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  incrementWorkouts: () => void;
  incrementAchievements: () => void;
  updateStreak: (streak: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set) => ({
  // State
  profile: null,
  isLoading: false,
  error: null,

  // Actions
  setProfile: (profile) => set({ profile }),
  
  updateProfile: (updates) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...updates } : null
  })),
  
  updatePreferences: (preferences) => set((state) => ({
    profile: state.profile ? {
      ...state.profile,
      preferences: { ...state.profile.preferences, ...preferences }
    } : null
  })),
  
  incrementWorkouts: () => set((state) => ({
    profile: state.profile ? {
      ...state.profile,
      totalWorkouts: state.profile.totalWorkouts + 1
    } : null
  })),
  
  incrementAchievements: () => set((state) => ({
    profile: state.profile ? {
      ...state.profile,
      achievements: state.profile.achievements + 1
    } : null
  })),
  
  updateStreak: (streak) => set((state) => ({
    profile: state.profile ? {
      ...state.profile,
      currentStreak: streak
    } : null
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 
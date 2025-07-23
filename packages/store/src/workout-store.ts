import { create } from 'zustand';
import type { Workout, Exercise } from '@fitness-tracker/shared';

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
}

interface WorkoutActions {
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  setCurrentWorkout: (workout: Workout | null) => void;
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type WorkoutStore = WorkoutState & WorkoutActions;

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  // State
  workouts: [],
  currentWorkout: null,
  exercises: [],
  isLoading: false,
  error: null,

  // Actions
  setWorkouts: (workouts) => set({ workouts }),
  
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, workout]
  })),
  
  updateWorkout: (id, workout) => set((state) => ({
    workouts: state.workouts.map((w) => 
      w.id === id ? { ...w, ...workout } : w
    )
  })),
  
  deleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.filter((w) => w.id !== id)
  })),
  
  setCurrentWorkout: (currentWorkout) => set({ currentWorkout }),
  
  setExercises: (exercises) => set({ exercises }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 
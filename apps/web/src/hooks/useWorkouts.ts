import { useState, useEffect } from 'react';
import { useWorkoutStore } from '@fitness-tracker/store';

// Define a simplified workout type for our hooks
interface WorkoutData {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'hiit';
  duration: number;
  calories: number;
  date: string;
  completed: boolean;
  exercises: any[];
  notes?: string;
}

// Real API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = {
  getWorkouts: async (): Promise<WorkoutData[]> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts?userId=user1`);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    return response.json();
  },

  createWorkout: async (workout: Omit<WorkoutData, 'id'>): Promise<WorkoutData> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts?userId=user1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create workout');
    }
    
    return response.json();
  },

  updateWorkout: async (id: string, workout: Partial<WorkoutData>): Promise<WorkoutData> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/${id}?userId=user1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update workout');
    }
    
    return response.json();
  },

  deleteWorkout: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/${id}?userId=user1`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete workout');
    }
  }
};

export const useWorkouts = () => {
  const { workouts, setWorkouts, setLoading, setError } = useWorkoutStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load workouts on mount
  useEffect(() => {
    const loadWorkouts = async () => {
      setLoading(true);
      try {
        const data = await api.getWorkouts();
        setWorkouts(data as any);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [setWorkouts, setLoading, setError]);

  const createWorkout = async (workout: Omit<WorkoutData, 'id'>) => {
    setIsCreating(true);
    try {
      const newWorkout = await api.createWorkout(workout);
      setWorkouts([...workouts, newWorkout as any]);
      return newWorkout;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateWorkout = async (id: string, workout: Partial<WorkoutData>) => {
    setIsUpdating(true);
    try {
      const updatedWorkout = await api.updateWorkout(id, workout);
      setWorkouts(workouts.map(w => w.id === id ? updatedWorkout as any : w));
      return updatedWorkout;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    workouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    isCreating,
    isUpdating,
    isDeleting,
  };
}; 
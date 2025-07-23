import { useState, useEffect } from 'react';
import { useGoalsStore, type FitnessGoal } from '@fitness-tracker/store';

// Real API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = {
  getGoals: async (): Promise<FitnessGoal[]> => {
    const response = await fetch(`${API_BASE_URL}/api/goals?userId=user1`);
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    return response.json();
  },

  createGoal: async (goal: Omit<FitnessGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<FitnessGoal> => {
    const response = await fetch(`${API_BASE_URL}/api/goals?userId=user1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create goal');
    }
    
    return response.json();
  },

  updateGoal: async (id: string, goal: Partial<FitnessGoal>): Promise<FitnessGoal> => {
    const response = await fetch(`${API_BASE_URL}/api/goals/${id}?userId=user1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update goal');
    }
    
    return response.json();
  },

  updateGoalProgress: async (id: string, current: number): Promise<FitnessGoal> => {
    const response = await fetch(`${API_BASE_URL}/api/goals/${id}/progress?userId=user1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ current }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update goal progress');
    }
    
    return response.json();
  },

  deleteGoal: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/goals/${id}?userId=user1`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete goal');
    }
  }
};

export const useGoals = () => {
  const { goals, setGoals, setLoading, setError } = useGoalsStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load goals on mount
  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);
      try {
        const data = await api.getGoals();
        setGoals(data);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [setGoals, setLoading, setError]);

  const createGoal = async (goal: Omit<FitnessGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsCreating(true);
    try {
      const newGoal = await api.createGoal(goal);
      setGoals([...goals, newGoal]);
      return newGoal;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateGoal = async (id: string, goal: Partial<FitnessGoal>) => {
    setIsUpdating(true);
    try {
      const updatedGoal = await api.updateGoal(id, goal);
      setGoals(goals.map(g => g.id === id ? updatedGoal : g));
      return updatedGoal;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteGoal = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const updateGoalProgress = async (id: string, current: number) => {
    setIsUpdating(true);
    try {
      const updatedGoal = await api.updateGoalProgress(id, current);
      setGoals(goals.map(g => g.id === id ? updatedGoal : g));
      return updatedGoal;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    goals,
    createGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    isCreating,
    isUpdating,
    isDeleting,
  };
}; 
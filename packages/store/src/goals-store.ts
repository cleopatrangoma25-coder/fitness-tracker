import { create } from 'zustand';

export interface FitnessGoal {
  id: string;
  title: string;
  type: 'weight' | 'strength' | 'endurance' | 'frequency' | 'custom';
  category: 'fitness' | 'health' | 'performance' | 'lifestyle';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  progress: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface GoalsState {
  goals: FitnessGoal[];
  isLoading: boolean;
  error: string | null;
}

interface GoalsActions {
  setGoals: (goals: FitnessGoal[]) => void;
  addGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, goal: Partial<FitnessGoal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, current: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type GoalsStore = GoalsState & GoalsActions;

export const useGoalsStore = create<GoalsStore>((set) => ({
  // State
  goals: [],
  isLoading: false,
  error: null,

  // Actions
  setGoals: (goals) => set({ goals }),
  
  addGoal: (goal) => set((state) => {
    const newGoal: FitnessGoal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      goals: [...state.goals, newGoal]
    };
  }),
  
  updateGoal: (id, goal) => set((state) => ({
    goals: state.goals.map((g) => 
      g.id === id ? { ...g, ...goal, updatedAt: new Date().toISOString() } : g
    )
  })),
  
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter((g) => g.id !== id)
  })),
  
  updateGoalProgress: (id, current) => set((state) => ({
    goals: state.goals.map((g) => {
      if (g.id === id) {
        const progress = Math.min((current / g.target) * 100, 100);
        const completed = progress >= 100;
        return {
          ...g,
          current,
          progress,
          completed,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    })
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 
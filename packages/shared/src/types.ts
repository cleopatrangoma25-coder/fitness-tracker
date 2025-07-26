// Common types used across the application

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  displayName: string;
}

export interface WorkoutForm {
  name: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      reps: number;
      weight?: number;
    }>;
  }>;
}

// Workout input types for API operations
export interface CreateWorkoutInput {
  userId: string;
  name: string;
  date: Date;
  durationMinutes: number;
  exercises: Array<{
    exerciseId: string;
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      completed: boolean;
    }>;
  }>;
}

export interface UpdateWorkoutInput {
  name?: string;
  date?: Date;
  durationMinutes?: number;
  exercises?: Array<{
    exerciseId: string;
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      completed: boolean;
    }>;
  }>;
}

export interface AddExerciseToWorkoutInput {
  exerciseId: string;
  name: string;
  sets: Array<{
    reps: number;
    weight?: number;
    completed: boolean;
  }>;
}

export interface UpdateExerciseLogInput {
  exerciseIndex: number;
  setIndex: number;
  reps?: number;
  weight?: number;
  completed?: boolean;
}

// User types
export interface User {
  userId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  height?: number; // cm
  weight?: number; // kg
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  preferences?: {
    units: 'metric' | 'imperial';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'workout' | 'weight' | 'strength' | 'endurance' | 'flexibility' | 'custom';
  target: {
    value: number;
    unit: string;
  };
  current: {
    value: number;
    unit: string;
  };
  deadline?: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalInput {
  userId: string;
  title: string;
  description?: string;
  type: Goal['type'];
  target: {
    value: number;
    unit: string;
  };
  deadline?: Date;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  target?: {
    value: number;
    unit: string;
  };
  current?: {
    value: number;
    unit: string;
  };
  deadline?: Date;
  status?: Goal['status'];
  progress?: number;
} 
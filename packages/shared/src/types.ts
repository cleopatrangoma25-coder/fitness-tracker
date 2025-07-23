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
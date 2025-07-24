import { z } from 'zod';

// User schema
export const UserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['USER', 'COACH', 'ADMIN']),
  coachId: z.string().optional(),
  profileImage: z.string().url().optional(),
  dateOfBirth: z.date().optional(),
  height: z.number().min(0).optional(), // in cm
  weight: z.number().min(0).optional(), // in kg
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  goals: z.array(z.string()).optional(),
  preferences: z.object({
    units: z.enum(['METRIC', 'IMPERIAL']).default('METRIC'),
    notifications: z.boolean().default(true),
    privacy: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']).default('PRIVATE'),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Workout schema
export const WorkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  date: z.date(),
  durationMinutes: z.number().min(0),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    name: z.string(),
    sets: z.array(z.object({
      reps: z.number().min(0),
      weight: z.number().min(0).optional(),
      completed: z.boolean(),
    })),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Workout = z.infer<typeof WorkoutSchema>;

// Goal schema
export const GoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['WEIGHT', 'DISTANCE', 'FREQUENCY', 'STRENGTH', 'ENDURANCE']),
  title: z.string().min(1),
  description: z.string().optional(),
  targetValue: z.number().min(0),
  currentValue: z.number().min(0).default(0),
  unit: z.string().min(1),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']).default('ACTIVE'),
  startDate: z.date(),
  deadline: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Goal = z.infer<typeof GoalSchema>;

// Exercise schema
export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  muscleGroup: z.enum(['CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'GLUTES', 'HIPS', 'TUMMY', 'CORE', 'CARDIO']),
  equipment: z.array(z.string()),
  instructions: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

// Authentication schemas
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  displayName: z.string().min(1),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  profileImage: z.string().url().optional(),
  dateOfBirth: z.date().optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  goals: z.array(z.string()).optional(),
  preferences: z.object({
    units: z.enum(['METRIC', 'IMPERIAL']).optional(),
    notifications: z.boolean().optional(),
    privacy: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']).optional(),
  }).optional(),
});

// Fitness Plan schemas
export const PlanPhaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  duration: z.number().min(1), // in weeks
  description: z.string().optional(),
  goals: z.array(z.string()),
  exercises: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    sets: z.number().min(1),
    reps: z.string(),
    rest: z.string(),
    notes: z.string().optional(),
    daysPerWeek: z.number().min(1).max(7),
  })),
});

export const FitnessPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1), // in weeks
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  focus: z.enum(['strength', 'cardio', 'flexibility', 'weight_loss', 'muscle_gain', 'general']),
  phases: z.array(PlanPhaseSchema),
  isActive: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PlanPhase = z.infer<typeof PlanPhaseSchema>;
export type FitnessPlan = z.infer<typeof FitnessPlanSchema>;

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>; 
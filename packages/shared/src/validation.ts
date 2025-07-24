import { z } from 'zod';

// Workout validation schemas
export const WorkoutFormSchema = z.object({
  name: z.string().min(1, 'Workout name is required').max(100, 'Workout name must be less than 100 characters'),
  type: z.enum(['cardio', 'strength', 'flexibility', 'hiit'], {
    required_error: 'Please select a workout type'
  }),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours'),
  calories: z.number().min(0, 'Calories cannot be negative').max(2000, 'Calories seem too high'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  date: z.string().optional(),
});

export const WorkoutUpdateSchema = WorkoutFormSchema.partial();

// Goal validation schemas
export const GoalFormSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(100, 'Goal title must be less than 100 characters'),
  type: z.enum(['weight', 'strength', 'endurance', 'frequency', 'custom'], {
    required_error: 'Please select a goal type'
  }),
  category: z.enum(['fitness', 'health', 'performance', 'lifestyle'], {
    required_error: 'Please select a category'
  }),
  target: z.number().min(0.1, 'Target must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select difficulty level'
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select priority level'
  }),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const GoalProgressSchema = z.object({
  current: z.number().min(0, 'Current value cannot be negative'),
});

// Profile validation schemas
export const ProfileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  displayName: z.string().min(1, 'Display name is required').max(30, 'Display name must be less than 30 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z.number().min(13, 'You must be at least 13 years old').max(120, 'Please enter a valid age'),
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm'),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must be less than 300kg'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your fitness level'
  }),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export const SettingsFormSchema = z.object({
  units: z.enum(['metric', 'imperial'], {
    required_error: 'Please select measurement units'
  }),
  notifications: z.object({
    workoutReminders: z.boolean(),
    goalUpdates: z.boolean(),
    achievements: z.boolean(),
    weeklyReports: z.boolean(),
  }),
});

// Dashboard stats validation
export const DashboardStatsSchema = z.object({
  totalWorkouts: z.number().min(0),
  thisWeek: z.number().min(0),
  totalCalories: z.number().min(0),
  streak: z.number().min(0),
});

// Type exports
export type WorkoutFormData = z.infer<typeof WorkoutFormSchema>;
export type WorkoutUpdateData = z.infer<typeof WorkoutUpdateSchema>;
export type GoalFormData = z.infer<typeof GoalFormSchema>;
export type GoalProgressData = z.infer<typeof GoalProgressSchema>;
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
export type SettingsFormData = z.infer<typeof SettingsFormSchema>;
export type DashboardStatsData = z.infer<typeof DashboardStatsSchema>; 
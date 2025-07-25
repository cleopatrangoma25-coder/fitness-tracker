// Stack-based component organization
// This organizes components by their technical stack/layer

// UI Stack - Reusable UI components from the UI package
export * from '@fitness-tracker/ui';

// Layout Stack - Layout and navigation components
export * from '../layout/Navigation';
export * from '../layout/ThemeToggle';

// Auth Stack - Authentication and authorization
export * from '../auth/AuthProvider';
export * from '../auth/ProtectedRoute';
export * from '../auth/SignInForm';
export * from '../auth/SignUpForm';
export * from '../auth/AuthDebugger';

// Feature Stacks - Domain-specific features
export * from '../dashboard/ProgressCharts';
export * from '../goals/FitnessPlan';
export * from '../goals/GoalSetting';
export * from '../profile/ProfileDisplay';
export * from '../profile/ProfileForm';
export * from '../workout/ActiveWorkout';
export * from '../workout/WorkoutCreation';
export * from '../workout/WorkoutDetail';
export * from '../workout/WorkoutHistory';
export * from '../workout/WorkoutLog';
export * from '../workout/WorkoutTemplates';
export * from '../workout/ExerciseInstructions';
export * from '../workout/RestTimer';
export * from '../onboarding/OnboardingFlow'; 
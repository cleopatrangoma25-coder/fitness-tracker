// Feature-based component exports
// This organizes components by feature/domain rather than technical type

// Auth Feature
export * from '../auth/AuthProvider';
export * from '../auth/ProtectedRoute';
export * from '../auth/SignInForm';
export * from '../auth/SignUpForm';
export * from '../auth/AuthDebugger';

// Dashboard Feature
export * from '../dashboard/ProgressCharts';

// Goals Feature
export * from '../goals/FitnessPlan';
export * from '../goals/GoalSetting';

// Profile Feature
export * from '../profile/ProfileDisplay';
export * from '../profile/ProfileForm';

// Workout Feature
export * from '../workout/ActiveWorkout';
export * from '../workout/WorkoutCreation';
export * from '../workout/WorkoutDetail';
export * from '../workout/WorkoutHistory';
export * from '../workout/WorkoutLog';
export * from '../workout/WorkoutTemplates';
export * from '../workout/ExerciseInstructions';
export * from '../workout/RestTimer';

// Onboarding Feature
export * from '../onboarding/OnboardingFlow';

// Layout Feature
export * from '../layout/Navigation';
export * from '../layout/ThemeToggle'; 
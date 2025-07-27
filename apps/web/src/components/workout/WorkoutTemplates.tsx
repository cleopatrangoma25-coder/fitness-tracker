import React from 'react';
import { Card, Button } from '@fitness-tracker/ui';
import type { Exercise } from '@fitness-tracker/shared';

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: Array<{
    exerciseName: string;
    sets: number;
    reps: number;
    muscleGroup: string;
  }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: number; // in minutes
}

interface WorkoutTemplatesProps {
  onSelectTemplate: (template: WorkoutTemplate) => void;
  availableExercises: Exercise[];
}

const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // QUICK WORKOUT TEMPLATES
  {
    id: 'quick-15',
    name: 'Quick 15-Minute',
    description: 'Fast and effective full-body workout for when you\'re short on time.',
    difficulty: 'Beginner',
    estimatedDuration: 15,
    exercises: [
      { exerciseName: 'Push-ups', sets: 3, reps: 10, muscleGroup: 'CHEST' },
      { exerciseName: 'Squats', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Plank', sets: 3, reps: 30, muscleGroup: 'CORE' },
      { exerciseName: 'Jump Squats', sets: 2, reps: 10, muscleGroup: 'LEGS' },
      { exerciseName: 'Mountain Climbers', sets: 2, reps: 20, muscleGroup: 'CARDIO' },
    ]
  },
  {
    id: 'express-20',
    name: 'Express 20-Minute',
    description: 'Quick circuit workout targeting all major muscle groups.',
    difficulty: 'Beginner',
    estimatedDuration: 20,
    exercises: [
      { exerciseName: 'Push-ups', sets: 3, reps: 12, muscleGroup: 'CHEST' },
      { exerciseName: 'Squats', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Pull-ups', sets: 3, reps: 8, muscleGroup: 'BACK' },
      { exerciseName: 'Lunges', sets: 2, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Crunches', sets: 3, reps: 15, muscleGroup: 'TUMMY' },
      { exerciseName: 'Burpees', sets: 2, reps: 8, muscleGroup: 'CARDIO' },
    ]
  },
  {
    id: 'lunch-break-25',
    name: 'Lunch Break 25-Minute',
    description: 'Perfect workout to squeeze in during your lunch break.',
    difficulty: 'Intermediate',
    estimatedDuration: 25,
    exercises: [
      { exerciseName: 'Bench Press', sets: 3, reps: 10, muscleGroup: 'CHEST' },
      { exerciseName: 'Bent-over Rows', sets: 3, reps: 10, muscleGroup: 'BACK' },
      { exerciseName: 'Squats', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Overhead Press', sets: 2, reps: 10, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Bicep Curls', sets: 2, reps: 12, muscleGroup: 'BICEPS' },
      { exerciseName: 'Plank', sets: 2, reps: 45, muscleGroup: 'CORE' },
    ]
  },
  {
    id: 'morning-30',
    name: 'Morning Energizer 30-Minute',
    description: 'Wake up your body with this energizing morning workout.',
    difficulty: 'Beginner',
    estimatedDuration: 30,
    exercises: [
      { exerciseName: 'Jump Squats', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Push-ups', sets: 3, reps: 12, muscleGroup: 'CHEST' },
      { exerciseName: 'Mountain Climbers', sets: 3, reps: 20, muscleGroup: 'CARDIO' },
      { exerciseName: 'Glute Bridges', sets: 3, reps: 15, muscleGroup: 'GLUTES' },
      { exerciseName: 'Bicycle Crunches', sets: 3, reps: 15, muscleGroup: 'TUMMY' },
      { exerciseName: 'High Knees', sets: 2, reps: 30, muscleGroup: 'CARDIO' },
    ]
  },
  {
    id: 'quick-upper-20',
    name: 'Quick Upper Body 20-Minute',
    description: 'Fast upper body workout focusing on chest, back, and arms.',
    difficulty: 'Intermediate',
    estimatedDuration: 20,
    exercises: [
      { exerciseName: 'Bench Press', sets: 3, reps: 10, muscleGroup: 'CHEST' },
      { exerciseName: 'Pull-ups', sets: 3, reps: 8, muscleGroup: 'BACK' },
      { exerciseName: 'Overhead Press', sets: 2, reps: 10, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Bicep Curls', sets: 2, reps: 12, muscleGroup: 'BICEPS' },
      { exerciseName: 'Tricep Dips', sets: 2, reps: 12, muscleGroup: 'TRICEPS' },
    ]
  },
  {
    id: 'quick-lower-20',
    name: 'Quick Lower Body 20-Minute',
    description: 'Fast lower body workout focusing on legs, glutes, and core.',
    difficulty: 'Intermediate',
    estimatedDuration: 20,
    exercises: [
      { exerciseName: 'Squats', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Lunges', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Glute Bridges', sets: 3, reps: 15, muscleGroup: 'GLUTES' },
      { exerciseName: 'Calf Raises', sets: 3, reps: 20, muscleGroup: 'LEGS' },
      { exerciseName: 'Plank', sets: 2, reps: 45, muscleGroup: 'CORE' },
    ]
  },
  {
    id: 'cardio-blast-15',
    name: 'Cardio Blast 15-Minute',
    description: 'High-intensity cardio workout to get your heart pumping.',
    difficulty: 'Intermediate',
    estimatedDuration: 15,
    exercises: [
      { exerciseName: 'Burpees', sets: 3, reps: 10, muscleGroup: 'CARDIO' },
      { exerciseName: 'Jump Squats', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Mountain Climbers', sets: 3, reps: 25, muscleGroup: 'CARDIO' },
      { exerciseName: 'High Knees', sets: 3, reps: 30, muscleGroup: 'CARDIO' },
      { exerciseName: 'Box Jumps', sets: 2, reps: 8, muscleGroup: 'CARDIO' },
    ]
  },
  {
    id: 'core-focus-15',
    name: 'Core Focus 15-Minute',
    description: 'Quick core and tummy workout for a strong midsection.',
    difficulty: 'Beginner',
    estimatedDuration: 15,
    exercises: [
      { exerciseName: 'Plank', sets: 3, reps: 45, muscleGroup: 'CORE' },
      { exerciseName: 'Crunches', sets: 3, reps: 20, muscleGroup: 'TUMMY' },
      { exerciseName: 'Russian Twists', sets: 3, reps: 20, muscleGroup: 'TUMMY' },
      { exerciseName: 'Leg Raises', sets: 3, reps: 12, muscleGroup: 'TUMMY' },
      { exerciseName: 'Side Plank', sets: 2, reps: 30, muscleGroup: 'CORE' },
    ]
  },
  {
    id: 'glute-burn-20',
    name: 'Glute Burn 20-Minute',
    description: 'Quick glute-focused workout for booty gains.',
    difficulty: 'Beginner',
    estimatedDuration: 20,
    exercises: [
      { exerciseName: 'Glute Bridges', sets: 3, reps: 15, muscleGroup: 'GLUTES' },
      { exerciseName: 'Single-Leg Glute Bridges', sets: 3, reps: 12, muscleGroup: 'GLUTES' },
      { exerciseName: 'Donkey Kicks', sets: 3, reps: 15, muscleGroup: 'GLUTES' },
      { exerciseName: 'Fire Hydrants', sets: 3, reps: 12, muscleGroup: 'GLUTES' },
      { exerciseName: 'Sumo Squats', sets: 3, reps: 15, muscleGroup: 'GLUTES' },
    ]
  },
  {
    id: 'tummy-toner-15',
    name: 'Tummy Toner 15-Minute',
    description: 'Quick ab workout for a toned tummy.',
    difficulty: 'Beginner',
    estimatedDuration: 15,
    exercises: [
      { exerciseName: 'Crunches', sets: 3, reps: 20, muscleGroup: 'TUMMY' },
      { exerciseName: 'Bicycle Crunches', sets: 3, reps: 15, muscleGroup: 'TUMMY' },
      { exerciseName: 'Leg Raises', sets: 3, reps: 12, muscleGroup: 'TUMMY' },
      { exerciseName: 'Russian Twists', sets: 3, reps: 20, muscleGroup: 'TUMMY' },
      { exerciseName: 'Dead Bug', sets: 2, reps: 10, muscleGroup: 'TUMMY' },
    ]
  },
  // STANDARD WORKOUT TEMPLATES
  {
    id: 'push-pull-legs',
    name: 'Push/Pull/Legs',
    description: 'Classic 3-day split focusing on pushing movements, pulling movements, and leg training.',
    difficulty: 'Intermediate',
    estimatedDuration: 60,
    exercises: [
      // Push Day
      { exerciseName: 'Bench Press', sets: 4, reps: 8, muscleGroup: 'CHEST' },
      { exerciseName: 'Overhead Press', sets: 3, reps: 10, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Dumbbell Flyes', sets: 3, reps: 12, muscleGroup: 'CHEST' },
      { exerciseName: 'Lateral Raises', sets: 3, reps: 15, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Tricep Dips', sets: 3, reps: 12, muscleGroup: 'TRICEPS' },
      { exerciseName: 'Skull Crushers', sets: 3, reps: 12, muscleGroup: 'TRICEPS' },
      
      // Pull Day
      { exerciseName: 'Pull-ups', sets: 4, reps: 8, muscleGroup: 'BACK' },
      { exerciseName: 'Bent-over Rows', sets: 4, reps: 10, muscleGroup: 'BACK' },
      { exerciseName: 'Lat Pulldowns', sets: 3, reps: 12, muscleGroup: 'BACK' },
      { exerciseName: 'Bicep Curls', sets: 3, reps: 12, muscleGroup: 'BICEPS' },
      { exerciseName: 'Hammer Curls', sets: 3, reps: 12, muscleGroup: 'BICEPS' },
      
      // Legs Day
      { exerciseName: 'Squats', sets: 4, reps: 8, muscleGroup: 'LEGS' },
      { exerciseName: 'Deadlifts', sets: 4, reps: 6, muscleGroup: 'LEGS' },
      { exerciseName: 'Lunges', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Leg Press', sets: 3, reps: 15, muscleGroup: 'LEGS' },
    ]
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: 'Complete workout targeting all major muscle groups in one session.',
    difficulty: 'Beginner',
    estimatedDuration: 45,
    exercises: [
      { exerciseName: 'Squats', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Push-ups', sets: 3, reps: 10, muscleGroup: 'CHEST' },
      { exerciseName: 'Pull-ups', sets: 3, reps: 8, muscleGroup: 'BACK' },
      { exerciseName: 'Overhead Press', sets: 3, reps: 10, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Bicep Curls', sets: 3, reps: 12, muscleGroup: 'BICEPS' },
      { exerciseName: 'Tricep Dips', sets: 3, reps: 12, muscleGroup: 'TRICEPS' },
      { exerciseName: 'Plank', sets: 3, reps: 30, muscleGroup: 'CORE' },
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    description: '4-day split alternating between upper and lower body workouts.',
    difficulty: 'Intermediate',
    estimatedDuration: 50,
    exercises: [
      // Upper Body
      { exerciseName: 'Bench Press', sets: 4, reps: 8, muscleGroup: 'CHEST' },
      { exerciseName: 'Pull-ups', sets: 4, reps: 8, muscleGroup: 'BACK' },
      { exerciseName: 'Overhead Press', sets: 3, reps: 10, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Bent-over Rows', sets: 3, reps: 10, muscleGroup: 'BACK' },
      { exerciseName: 'Bicep Curls', sets: 3, reps: 12, muscleGroup: 'BICEPS' },
      { exerciseName: 'Tricep Dips', sets: 3, reps: 12, muscleGroup: 'TRICEPS' },
      
      // Lower Body
      { exerciseName: 'Squats', sets: 4, reps: 8, muscleGroup: 'LEGS' },
      { exerciseName: 'Deadlifts', sets: 4, reps: 6, muscleGroup: 'LEGS' },
      { exerciseName: 'Lunges', sets: 3, reps: 12, muscleGroup: 'LEGS' },
      { exerciseName: 'Leg Press', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Crunches', sets: 3, reps: 20, muscleGroup: 'CORE' },
      { exerciseName: 'Russian Twists', sets: 3, reps: 20, muscleGroup: 'CORE' },
    ]
  },
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Focus on building maximum strength with compound movements.',
    difficulty: 'Advanced',
    estimatedDuration: 75,
    exercises: [
      { exerciseName: 'Squats', sets: 5, reps: 5, muscleGroup: 'LEGS' },
      { exerciseName: 'Deadlifts', sets: 5, reps: 5, muscleGroup: 'LEGS' },
      { exerciseName: 'Bench Press', sets: 5, reps: 5, muscleGroup: 'CHEST' },
      { exerciseName: 'Overhead Press', sets: 5, reps: 5, muscleGroup: 'SHOULDERS' },
      { exerciseName: 'Bent-over Rows', sets: 5, reps: 5, muscleGroup: 'BACK' },
    ]
  },
  {
    id: 'cardio-strength',
    name: 'Cardio + Strength',
    description: 'Combination workout with cardio and strength training.',
    difficulty: 'Intermediate',
    estimatedDuration: 60,
    exercises: [
      { exerciseName: 'Running', sets: 1, reps: 20, muscleGroup: 'CARDIO' },
      { exerciseName: 'Squats', sets: 3, reps: 15, muscleGroup: 'LEGS' },
      { exerciseName: 'Push-ups', sets: 3, reps: 15, muscleGroup: 'CHEST' },
      { exerciseName: 'Cycling', sets: 1, reps: 15, muscleGroup: 'CARDIO' },
      { exerciseName: 'Pull-ups', sets: 3, reps: 10, muscleGroup: 'BACK' },
      { exerciseName: 'Plank', sets: 3, reps: 45, muscleGroup: 'CORE' },
    ]
  }
];

export const WorkoutTemplates: React.FC<WorkoutTemplatesProps> = ({ 
  onSelectTemplate, 
  availableExercises 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'Intermediate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getAvailableExercisesForTemplate = (template: WorkoutTemplate) => {
    return template.exercises.filter(exercise => 
      availableExercises.some(available => 
        available.name.toLowerCase().includes(exercise.exerciseName.toLowerCase()) ||
        exercise.exerciseName.toLowerCase().includes(available.name.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden bg-hero-fitness bg-repeat shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustration */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-4 animate-pulse drop-shadow-2xl text-white">
            🚀 Ready to Transform Your Fitness?
          </h1>
          <p className="text-xl mb-6 text-white drop-shadow-xl font-medium">
            Choose your perfect workout template and start your fitness journey today!
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-white/40 rounded-full px-4 py-2 border border-white/60 shadow-lg drop-shadow-md backdrop-blur-sm">
              <span className="font-semibold text-white">⚡ Quick Workouts</span>
            </div>
            <div className="bg-white/40 rounded-full px-4 py-2 border border-white/60 shadow-lg drop-shadow-md backdrop-blur-sm">
              <span className="font-semibold text-white">🏋️ Full Sessions</span>
            </div>
            <div className="bg-white/40 rounded-full px-4 py-2 border border-white/60 shadow-lg drop-shadow-md backdrop-blur-sm">
              <span className="font-semibold text-white">🎯 Goal-Focused</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Workout Templates Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quick Workouts</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Perfect for busy schedules - 15-30 minutes</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300">
              {WORKOUT_TEMPLATES.filter(t => t.estimatedDuration <= 30).length} Templates Available
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKOUT_TEMPLATES.filter(template => template.estimatedDuration <= 30).map((template, index) => {
            const availableExercises = getAvailableExercisesForTemplate(template);
            const isPopular = template.id === 'quick-15' || template.id === 'express-20';
            
            return (
              <div
                key={template.id}
                className={`group relative bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  isPopular ? 'ring-2 ring-blue-200 dark:ring-blue-500' : ''
                }`}
                onClick={() => onSelectTemplate(template)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      🔥 POPULAR
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h4>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full transition-colors duration-300">
                      {template.estimatedDuration}min
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                      {availableExercises.length} exercises
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-colors duration-300">{template.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <div className="flex space-x-1">
                    {template.exercises.slice(0, 3).map((exercise, idx) => (
                      <div key={idx} className="w-2 h-2 bg-blue-300 dark:bg-blue-400 rounded-full transition-colors duration-300"></div>
                    ))}
                    {template.exercises.length > 3 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">+{template.exercises.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 transition-colors duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Ready to start?</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform transition-colors duration-300">
                      Let's Go! →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standard Workout Templates Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
              <span className="text-2xl">🏋️</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Standard Workouts</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Complete training sessions - 45-75 minutes</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300">
              {WORKOUT_TEMPLATES.filter(t => t.estimatedDuration > 30).length} Templates Available
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKOUT_TEMPLATES.filter(template => template.estimatedDuration > 30).map((template, index) => {
            const availableExercises = getAvailableExercisesForTemplate(template);
            
            return (
              <div
                key={template.id}
                className="group relative bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-green-300 dark:hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => onSelectTemplate(template)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {template.name}
                  </h4>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full transition-colors duration-300">
                      {template.estimatedDuration}min
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                      {availableExercises.length} exercises
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-colors duration-300">{template.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <div className="flex space-x-1">
                    {template.exercises.slice(0, 3).map((exercise, idx) => (
                      <div key={idx} className="w-2 h-2 bg-green-300 dark:bg-green-400 rounded-full transition-colors duration-300"></div>
                    ))}
                    {template.exercises.length > 3 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">+{template.exercises.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 transition-colors duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Ready for a challenge?</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-1 transition-transform transition-colors duration-300">
                      Let's Go! →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          💪 Every Workout Counts!
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you have 15 minutes or 75 minutes, every workout brings you closer to your fitness goals. 
          Choose a template that fits your schedule and start building the stronger, healthier version of yourself!
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="font-medium text-purple-600">🎯 Set Goals</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="font-medium text-purple-600">📈 Track Progress</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="font-medium text-purple-600">🏆 Celebrate Wins</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
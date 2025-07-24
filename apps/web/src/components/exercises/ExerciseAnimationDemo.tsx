import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';
import { AnimatedExercise } from './AnimatedExercise';

const AVAILABLE_EXERCISES = [
  { name: 'Push-ups', description: 'Classic chest and tricep exercise', difficulty: 'Beginner' },
  { name: 'Squats', description: 'Lower body strength builder', difficulty: 'Beginner' },
  { name: 'Pull-ups', description: 'Upper body pulling exercise', difficulty: 'Advanced' },
  { name: 'Plank', description: 'Core stability exercise', difficulty: 'Beginner' },
  { name: 'Lunges', description: 'Unilateral leg exercise', difficulty: 'Beginner' }
];

export const ExerciseAnimationDemo: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  if (selectedExercise) {
    return (
      <AnimatedExercise 
        exerciseName={selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
      />
    );
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎬 Exercise Animations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Watch interactive animated demonstrations of popular exercises. 
            Learn proper form and technique with step-by-step visual guides.
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_EXERCISES.map((exercise) => (
            <div
              key={exercise.name}
              className="bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              onClick={() => setSelectedExercise(exercise.name)}
            >
              <div className="text-center space-y-4">
                {/* Exercise Icon */}
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  {exercise.name === 'Push-ups' && '💪'}
                  {exercise.name === 'Squats' && '🦵'}
                  {exercise.name === 'Pull-ups' && '🏋️'}
                  {exercise.name === 'Plank' && '🧘'}
                  {exercise.name === 'Lunges' && '🚶'}
                </div>

                {/* Exercise Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {exercise.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {exercise.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    exercise.difficulty === 'Beginner' 
                      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
                      : exercise.difficulty === 'Intermediate'
                      ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
                      : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                  }`}>
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise.name);
                  }}
                  className="w-full group-hover:bg-blue-600 transition-colors duration-300"
                >
                  <span className="mr-2">▶️</span>
                  Watch Animation
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            🚀 Animation Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl mb-3">
                🎯
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Step-by-Step</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow each phase of the exercise with detailed animations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xl mb-3">
                ⏱️
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timing Control</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Play, pause, and reset animations at your own pace
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl mb-3">
                📱
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Works perfectly on desktop, tablet, and mobile devices
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            More exercises coming soon! We're constantly adding new animated demonstrations.
          </p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
              Deadlifts
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
              Bench Press
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
              Burpees
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
              Mountain Climbers
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}; 
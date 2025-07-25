import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@fitness-tracker/ui';
import type { Exercise } from '@fitness-tracker/shared';
import { WorkoutService } from '../../lib/workout';
import { ExerciseInstructions } from './ExerciseInstructions';

interface WorkoutCreationProps {
  onWorkoutCreated: (workoutName: string, exercises: Exercise[], timerSettings: { exerciseDuration: number; restDuration: number }) => void;
  onCancel: () => void;
}

export const WorkoutCreation: React.FC<WorkoutCreationProps> = ({
  onWorkoutCreated,
  onCancel
}) => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('ALL');
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedExerciseForInstructions, setSelectedExerciseForInstructions] = useState<Exercise | null>(null);
  const [exerciseTimerDuration, setExerciseTimerDuration] = useState(120); // 2 minutes default
  const [restTimerDuration, setRestTimerDuration] = useState(90); // 90 seconds default

  // Load exercises from database
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await WorkoutService.getExercises();
        if (exercises.length === 0) {
          console.log('No exercises in database, using comprehensive fallback exercises');
          const fallbackExercises: Exercise[] = [
            // CHEST EXERCISES
            { id: '1', name: 'Push-ups', muscleGroup: 'CHEST', equipment: [], instructions: 'Start in plank position, lower chest to ground, push back up', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Bench Press', muscleGroup: 'CHEST', equipment: ['Barbell', 'Bench'], instructions: 'Lie on bench, lower bar to chest, press up', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', name: 'Dumbbell Flyes', muscleGroup: 'CHEST', equipment: ['Dumbbells', 'Bench'], instructions: 'Lie on bench, lower dumbbells in arc motion', createdAt: new Date(), updatedAt: new Date() },
            
            // BACK EXERCISES
            { id: '9', name: 'Pull-ups', muscleGroup: 'BACK', equipment: ['Pull-up bar'], instructions: 'Hang from bar, pull body up until chin over bar', createdAt: new Date(), updatedAt: new Date() },
            { id: '10', name: 'Bent-over Rows', muscleGroup: 'BACK', equipment: ['Barbell'], instructions: 'Bend at waist, pull bar to lower chest', createdAt: new Date(), updatedAt: new Date() },
            { id: '11', name: 'Lat Pulldowns', muscleGroup: 'BACK', equipment: ['Cable machine'], instructions: 'Pull bar down to upper chest', createdAt: new Date(), updatedAt: new Date() },
            
            // SHOULDER EXERCISES
            { id: '17', name: 'Overhead Press', muscleGroup: 'SHOULDERS', equipment: ['Barbell'], instructions: 'Press barbell overhead until arms extended', createdAt: new Date(), updatedAt: new Date() },
            { id: '18', name: 'Lateral Raises', muscleGroup: 'SHOULDERS', equipment: ['Dumbbells'], instructions: 'Raise dumbbells out to sides to shoulder level', createdAt: new Date(), updatedAt: new Date() },
            
            // LEG EXERCISES
            { id: '35', name: 'Squats', muscleGroup: 'LEGS', equipment: [], instructions: 'Stand with feet shoulder-width, lower as if sitting back', createdAt: new Date(), updatedAt: new Date() },
            { id: '36', name: 'Deadlifts', muscleGroup: 'LEGS', equipment: ['Barbell'], instructions: 'Stand with barbell on ground, bend and grip, stand up straight', createdAt: new Date(), updatedAt: new Date() },
            { id: '37', name: 'Lunges', muscleGroup: 'LEGS', equipment: [], instructions: 'Step forward, lower until both knees bent at 90 degrees', createdAt: new Date(), updatedAt: new Date() },
          ];
          setAvailableExercises(fallbackExercises);
        } else {
          setAvailableExercises(exercises);
        }
      } catch (error) {
        console.error('Failed to load exercises:', error);
        setAvailableExercises([]);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  const handleExerciseToggle = (exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e.id === exercise.id);
      if (isSelected) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleStartWorkout = () => {
    if (workoutName.trim() && selectedExercises.length > 0) {
      onWorkoutCreated(workoutName, selectedExercises, {
        exerciseDuration: exerciseTimerDuration,
        restDuration: restTimerDuration
      });
    }
  };

  const handleShowInstructions = (exercise: Exercise, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent exercise selection
    setSelectedExerciseForInstructions(exercise);
    setShowInstructions(true);
  };

  const filteredExercises = selectedMuscleGroup === 'ALL' 
    ? availableExercises 
    : availableExercises.filter(exercise => exercise.muscleGroup === selectedMuscleGroup);

  const muscleGroups = ['ALL', 'CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'GLUTES', 'HIPS'];

  if (isLoadingExercises) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Creation Form */}
      <Card variant="elevated" className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🏋️ Create Workout</h2>
            <p className="text-gray-600 dark:text-gray-300">Set up your workout session</p>
          </div>
          <div className="text-3xl">💪</div>
        </div>

        {/* Workout Name */}
        <div className="mb-6">
          <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workout Name
          </label>
          <Input
            id="workout-name"
            type="text"
            placeholder="Enter workout name..."
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Timer Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">⏱️ Timer Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="exercise-timer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exercise Timer Duration
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="exercise-timer"
                  type="number"
                  min="30"
                  max="600"
                  step="30"
                  value={exerciseTimerDuration}
                  onChange={(e) => setExerciseTimerDuration(parseInt(e.target.value) || 120)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">seconds</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended time per exercise ({Math.floor(exerciseTimerDuration / 60)}m {exerciseTimerDuration % 60}s)
              </p>
            </div>
            <div>
              <label htmlFor="rest-timer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rest Timer Duration
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="rest-timer"
                  type="number"
                  min="30"
                  max="300"
                  step="15"
                  value={restTimerDuration}
                  onChange={(e) => setRestTimerDuration(parseInt(e.target.value) || 90)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">seconds</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Rest time between sets ({Math.floor(restTimerDuration / 60)}m {restTimerDuration % 60}s)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: 'Full Body', exercises: availableExercises.slice(0, 6) },
              { name: 'Upper Body', exercises: availableExercises.filter(e => ['CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS'].includes(e.muscleGroup)).slice(0, 5) },
              { name: 'Lower Body', exercises: availableExercises.filter(e => ['LEGS', 'GLUTES'].includes(e.muscleGroup)).slice(0, 4) }
            ].map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  setWorkoutName(template.name);
                  setSelectedExercises(template.exercises);
                }}
                className="justify-start"
              >
                <span className="mr-2">📋</span>
                {template.name} ({template.exercises.length})
              </Button>
            ))}
          </div>
        </div>

        {/* Muscle Group Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Muscle Group
          </label>
          <select
            value={selectedMuscleGroup}
            onChange={(e) => handleMuscleGroupSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group === 'ALL' ? 'All Muscle Groups' : group}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Exercises ({selectedExercises.length} selected)
            </h3>
            {selectedExercises.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExercises([])}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedExercises.some(e => e.id === exercise.id);
              return (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }`}
                  onClick={() => handleExerciseToggle(exercise)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {exercise.muscleGroup}
                      </p>
                      {exercise.instructions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {exercise.instructions}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleShowInstructions(exercise, e)}
                        className="text-xs px-2 py-1"
                      >
                        📖
                      </Button>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleStartWorkout}
            disabled={!workoutName.trim() || selectedExercises.length === 0}
            variant="primary"
            className="flex-1"
          >
            🚀 Start Workout ({selectedExercises.length} exercises)
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </Card>

      {/* Exercise Instructions Modal */}
      {showInstructions && selectedExerciseForInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ExerciseInstructions
              exerciseName={selectedExerciseForInstructions.name}
              onClose={() => {
                setShowInstructions(false);
                setSelectedExerciseForInstructions(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 
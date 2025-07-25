import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '@fitness-tracker/ui';
import { useWorkoutStore } from '@fitness-tracker/store';
import type { Workout } from '@fitness-tracker/shared';

export const WorkoutDetail: React.FC = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const { workouts } = useWorkoutStore();

  const workout = workouts.find(w => w.id === workoutId);

  if (!workout) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Workout Not Found</h1>
          <Button
            title="Back to Workout Log"
            onClick={() => navigate('/workout')}
            variant="outline"
          />
        </div>
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">The workout you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  const getWorkoutStats = (workout: Workout) => {
    const totalSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.length, 0
    );
    const completedSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0
    );
    const totalReps = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.reduce((setTotal, set) => setTotal + set.reps, 0), 0
    );
    const totalWeight = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.reduce((setTotal, set) => setTotal + (set.weight || 0), 0), 0
    );
    
    return { totalSets, completedSets, totalReps, totalWeight };
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  };

  const stats = getWorkoutStats(workout);
  const completionRate = stats.totalSets > 0 ? Math.round((stats.completedSets / stats.totalSets) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{workout.name}</h1>
        <div className="flex gap-2">
          <Button
            title="Back to Workout Log"
            onClick={() => navigate('/workout')}
            variant="outline"
          />
          <Button
            title="Edit Workout"
            onClick={() => navigate(`/workout/edit/${workout.id}`)}
            variant="outline"
          />
        </div>
      </div>

      {/* Workout Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{workout.exercises.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Exercises</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalSets}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Sets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalReps}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Reps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{formatDuration(workout.durationMinutes)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
          </div>
        </div>
      </Card>

      {/* Progress Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Progress Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-300">Completed Sets:</span>
              <span className="ml-2 font-medium text-green-600">{stats.completedSets}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">Remaining Sets:</span>
              <span className="ml-2 font-medium text-gray-600 dark:text-gray-300">{stats.totalSets - stats.completedSets}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Exercise Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Exercises</h2>
        {workout.exercises.map((exercise, exerciseIndex) => {
          const exerciseStats = {
            totalSets: exercise.sets.length,
            completedSets: exercise.sets.filter(set => set.completed).length,
            totalReps: exercise.sets.reduce((total, set) => total + set.reps, 0),
            totalWeight: exercise.sets.reduce((total, set) => total + (set.weight || 0), 0),
          };
          
          return (
            <Card key={exerciseIndex} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exerciseStats.totalSets} sets • {exerciseStats.totalReps} reps
                    {exerciseStats.totalWeight > 0 && ` • ${exerciseStats.totalWeight}kg total weight`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {exerciseStats.completedSets}/{exerciseStats.totalSets} completed
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${(exerciseStats.completedSets / exerciseStats.totalSets) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      set.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900 dark:text-white">Set {setIndex + 1}</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {set.reps} reps
                        {set.weight && ` • ${set.weight}kg`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {set.completed ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Workout Metadata */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Workout Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">Created:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{new Date(workout.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{new Date(workout.updatedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Date:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{new Date(workout.date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Duration:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{formatDuration(workout.durationMinutes)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}; 
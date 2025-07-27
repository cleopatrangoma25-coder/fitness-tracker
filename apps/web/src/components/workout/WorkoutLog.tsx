import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@fitness-tracker/ui';
import { useWorkoutStore } from '@fitness-tracker/store';

export const WorkoutLog: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading } = useWorkoutStore();

  const handleStartNewWorkout = () => {
    navigate('/workout/active');
  };

  const handleViewHistory = () => {
    navigate('/workout/history');
  };

  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading workouts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative z-10">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
              💪 Workout Hub
            </h1>
            <p className="text-xl text-white mb-6 drop-shadow-xl">
              Track your workouts, build strength, and achieve your fitness goals
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">{workouts.length}</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Total Workouts</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  {workouts.filter(w => w.exercises.every(e => e.sets.every(s => s.completed))).length}
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  {workouts.reduce((total, w) => total + w.exercises.reduce((sum, e) => sum + e.sets.length, 0), 0)}
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">Total Sets</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 mt-6 lg:mt-0">
            <button
              onClick={handleStartNewWorkout}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🚀 Start New Workout
            </button>
            <button
              onClick={handleViewHistory}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 border border-white/30 shadow-lg"
            >
              📊 View History
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {workouts.length === 0 ? (
          <Card variant="elevated" className="p-12 text-center">
            <div className="text-black mb-6">
              <div className="text-6xl mb-4">💪</div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No workouts yet</h3>
            <p className="text-black mb-6 text-lg">Start your fitness journey by creating your first workout!</p>
            <button
              onClick={handleStartNewWorkout}
              className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🚀 Start Your First Workout
            </button>
          </Card>
        ) : (
          workouts.slice(0, 5).map((workout) => {
            const isCompleted = workout.exercises.every(exercise => exercise.sets.every(set => set.completed));
            const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
            const completedSets = workout.exercises.reduce((total, exercise) => 
              total + exercise.sets.filter(set => set.completed).length, 0
            );
            
            return (
              <Card 
                key={workout.id} 
                variant={isCompleted ? "success" : "elevated"}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105" 
                onClick={() => handleViewWorkout(workout.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">
                        {isCompleted ? '🏆' : '💪'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">{workout.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <span>📅 {new Date(workout.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>🏋️ {workout.exercises.length} exercises</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black">
                          Progress: {completedSets} / {totalSets} sets
                        </span>
                        <span className={`font-bold ${
                          isCompleted ? 'text-success-600' : 'text-primary-600'
                        }`}>
                          {Math.round((completedSets / totalSets) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-gradient-success' : 'bg-gradient-primary'
                          }`}
                          style={{ width: `${(completedSets / totalSets) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-bold ${
                      isCompleted ? 'text-success-600' : 'text-primary-600'
                    }`}>
                      {totalSets}
                    </div>
                    <div className="text-xs text-black">Total Sets</div>
                    {isCompleted && (
                      <div className="text-xs text-success-600 font-medium mt-1">✅ Completed</div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {workouts.length > 5 && (
        <div className="text-center">
          <button
            onClick={handleViewHistory}
            className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            📊 View all {workouts.length} workouts →
          </button>
        </div>
      )}
    </div>
  );
}; 
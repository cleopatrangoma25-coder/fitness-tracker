import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@fitness-tracker/ui';
import { useWorkoutStore } from '@fitness-tracker/store';
import type { Workout } from '@fitness-tracker/shared';

export const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => 
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.exercises.some(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [workouts, searchTerm]);

  const paginatedWorkouts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWorkouts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWorkouts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);

  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleBackToLog = () => {
    navigate('/workout');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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
    
    return { totalSets, completedSets, totalReps };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Workout History</h1>
        <Button
          title="Back to Workout Log"
          onClick={handleBackToLog}
          variant="outline"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Workouts
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by workout name or exercise..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </Card>

      {/* Workout List */}
      <div className="space-y-4">
        {paginatedWorkouts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start your fitness journey by creating your first workout!'}
            </p>
          </Card>
        ) : (
          paginatedWorkouts.map((workout) => {
            const stats = getWorkoutStats(workout);
            const isCompleted = stats.completedSets === stats.totalSets;
            
            return (
              <Card 
                key={workout.id} 
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewWorkout(workout.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                      {isCompleted && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(workout.createdAt).toLocaleDateString()} • {workout.exercises.length} exercises
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{stats.totalSets}</div>
                        <div className="text-gray-500">Total Sets</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stats.completedSets}</div>
                        <div className="text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stats.totalReps}</div>
                        <div className="text-gray-500">Total Reps</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatDuration(workout.durationMinutes)}
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                title="Previous"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="small"
              />
              <Button
                title="Next"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="small"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}; 
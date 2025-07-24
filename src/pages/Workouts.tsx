import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Select, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Alert, AlertTitle, AlertDescription } from '@fitness-tracker/ui';
import { useWorkouts } from '../hooks/useWorkouts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkoutFormSchema, type WorkoutFormData } from '@fitness-tracker/shared';

export default function WorkoutsPage() {
  const { workouts, createWorkout, isCreating } = useWorkouts();
  const [showNewWorkoutDialog, setShowNewWorkoutDialog] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(WorkoutFormSchema),
    defaultValues: {
      name: '',
      type: 'cardio',
      duration: 30,
      calories: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const workoutTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'hiit', label: 'HIIT' }
  ];

  const filteredWorkouts = workouts.filter(workout => {
    const matchesType = filterType === 'all' || workout.type === filterType;
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'cardio': return '🏃‍♂️';
      case 'strength': return '💪';
      case 'flexibility': return '🧘‍♀️';
      case 'hiit': return '⚡';
      default: return '🏋️‍♂️';
    }
  };

  const getWorkoutBadgeVariant = (type) => {
    switch (type) {
      case 'cardio': return 'default';
      case 'strength': return 'primary';
      case 'flexibility': return 'secondary';
      case 'hiit': return 'accent';
      default: return 'default';
    }
  };

  const onSubmit = async (data: WorkoutFormData) => {
    try {
      await createWorkout({
        ...data,
        completed: true,
        exercises: [],
      });
      setShowNewWorkoutDialog(false);
      reset();
    } catch (error) {
      console.error('Failed to create workout:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
          <p className="text-gray-600">Track and manage your fitness sessions</p>
        </div>
        <Button onClick={() => setShowNewWorkoutDialog(true)}>Log New Workout</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Search Workouts"
                placeholder="Search by workout name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Filter by Type"
                value={filterType}
                onChange={(value) => setFilterType(value)}
                options={workoutTypes}
                placeholder="Select workout type"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{workouts.length}</div>
            <p className="text-sm text-gray-600">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {workouts.filter(w => w.completed).length}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {workouts.reduce((sum, w) => sum + (w.calories || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Calories</p>
          </CardContent>
        </Card>
      </div>

      {/* Workouts List */}
      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏋️‍♂️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or log your first workout!</p>
                <Button onClick={() => setShowNewWorkoutDialog(true)}>Log Your First Workout</Button>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getWorkoutIcon(workout.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{workout.name}</h3>
                        <Badge variant={getWorkoutBadgeVariant(workout.type)}>
                          {workout.type}
                        </Badge>
                        {workout.completed && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {workout.duration} min • {workout.calories} calories • {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Workout Dialog */}
      <Dialog open={showNewWorkoutDialog} onOpenChange={setShowNewWorkoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Workout</DialogTitle>
            <DialogDescription>
              Record your workout session to track your fitness progress.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Workout Name"
              placeholder="e.g., Morning Cardio, Strength Training"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <Select
              label="Workout Type"
              {...register('type')}
              options={[
                { value: 'cardio', label: 'Cardio' },
                { value: 'strength', label: 'Strength Training' },
                { value: 'flexibility', label: 'Flexibility' },
                { value: 'hiit', label: 'HIIT' }
              ]}
              placeholder="Select workout type"
              error={errors.type?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="30"
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
              />
              <Input
                label="Calories Burned"
                type="number"
                placeholder="250"
                {...register('calories', { valueAsNumber: true })}
                error={errors.calories?.message}
              />
            </div>
            
            <Input
              label="Date"
              type="date"
              {...register('date')}
              error={errors.date?.message}
            />
            
            <Input
              label="Notes (optional)"
              placeholder="How did your workout feel?"
              {...register('notes')}
              error={errors.notes?.message}
            />

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Please fix the following errors:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.values(errors).map((error, index) => (
                      <li key={index} className="text-sm">{error?.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowNewWorkoutDialog(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Saving...' : 'Save Workout'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
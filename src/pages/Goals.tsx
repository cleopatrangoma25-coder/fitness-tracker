import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Progress, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Select, Textarea, Alert, AlertTitle, AlertDescription } from '@fitness-tracker/ui';
import { useGoals } from '../hooks/useGoals';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoalFormSchema, type GoalFormData } from '@fitness-tracker/shared';

export default function GoalsPage() {
  const { goals, createGoal, deleteGoal, updateGoalProgress, isCreating, isDeleting } = useGoals();
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      title: '',
      type: 'weight',
      category: 'fitness',
      target: 0,
      unit: '',
      deadline: '',
      difficulty: 'intermediate',
      priority: 'medium',
      description: '',
    },
  });

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal' },
    { value: 'strength', label: 'Strength Goal' },
    { value: 'endurance', label: 'Endurance Goal' },
    { value: 'frequency', label: 'Workout Frequency' },
    { value: 'custom', label: 'Custom Goal' }
  ];

  const categories = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'health', label: 'Health' },
    { value: 'performance', label: 'Performance' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return goal.completed;
    if (filterStatus === 'active') return !goal.completed;
    if (filterStatus === 'overdue') return !goal.completed && new Date(goal.deadline) < new Date();
    return true;
  });

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'weight': return '⚖️';
      case 'strength': return '💪';
      case 'endurance': return '🏃‍♂️';
      case 'frequency': return '📅';
      default: return '🎯';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const activeGoals = goals.filter(goal => !goal.completed).length;
  const overdueGoals = goals.filter(goal => !goal.completed && new Date(goal.deadline) < new Date()).length;

  const onSubmit = async (data: GoalFormData) => {
    try {
      await createGoal({
        ...data,
        current: 0,
        completed: false,
        progress: 0,
      });
      setShowNewGoalDialog(false);
      reset();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoalToDelete(null);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fitness Goals</h1>
          <p className="text-gray-600">Set, track, and achieve your fitness objectives</p>
        </div>
        <Button onClick={() => setShowNewGoalDialog(true)}>Add New Goal</Button>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{goals.length}</div>
            <p className="text-sm text-gray-600">Total Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{completedGoals}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{activeGoals}</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{overdueGoals}</div>
            <p className="text-sm text-gray-600">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <Select
            label="Filter Goals"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: 'all', label: 'All Goals' },
              { value: 'active', label: 'Active Goals' },
              { value: 'completed', label: 'Completed Goals' },
              { value: 'overdue', label: 'Overdue Goals' }
            ]}
            placeholder="Filter goals by status"
          />
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
              <p className="text-gray-600 mb-4">Set your first fitness goal to start tracking your progress!</p>
              <Button onClick={() => setShowNewGoalDialog(true)}>Add Your First Goal</Button>
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;

            return (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-3xl">{getGoalIcon(goal.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          <Badge variant={goal.completed ? "success" : isOverdue ? "destructive" : "default"}>
                            {goal.completed ? "Completed" : isOverdue ? "Overdue" : "Active"}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                            {goal.priority} Priority
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="font-medium">{goal.current} / {goal.target} {goal.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Difficulty</p>
                            <p className="font-medium capitalize">{goal.difficulty}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Deadline</p>
                            <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                              {goal.deadline} {isOverdue ? `(${Math.abs(daysRemaining)} days overdue)` : `(${daysRemaining} days left)`}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="w-full" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">Update Progress</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setGoalToDelete(goal.id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Set a new fitness goal to track your progress and stay motivated.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Goal Title"
              placeholder="e.g., Lose 10kg, Run 5km in 25 minutes"
              {...register('title')}
              error={errors.title?.message}
            />
            
            <Select
              label="Goal Type"
              {...register('type')}
              options={goalTypes}
              placeholder="Select goal type"
              error={errors.type?.message}
            />
            
            <Select
              label="Category"
              {...register('category')}
              options={categories}
              placeholder="Select category"
              error={errors.category?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Target Value"
                type="number"
                placeholder="70"
                {...register('target', { valueAsNumber: true })}
                error={errors.target?.message}
              />
              <Input
                label="Unit"
                placeholder="kg, minutes, reps"
                {...register('unit')}
                error={errors.unit?.message}
              />
            </div>
            
            <Input
              label="Deadline"
              type="date"
              {...register('deadline')}
              error={errors.deadline?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Difficulty"
                {...register('difficulty')}
                options={difficulties}
                placeholder="Select difficulty"
                error={errors.difficulty?.message}
              />
              <Select
                label="Priority"
                {...register('priority')}
                options={priorities}
                placeholder="Select priority"
                error={errors.priority?.message}
              />
            </div>
            
            <Textarea
              label="Description"
              placeholder="Describe your goal and what you want to achieve..."
              rows={3}
              {...register('description')}
              error={errors.description?.message}
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
                  setShowNewGoalDialog(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!goalToDelete} onOpenChange={() => setGoalToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGoalToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => goalToDelete && handleDeleteGoal(goalToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
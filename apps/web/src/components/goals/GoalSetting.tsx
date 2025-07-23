import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

export interface FitnessGoal {
  id: string;
  type: 'weight' | 'strength' | 'endurance' | 'workout_frequency' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
}

interface GoalSettingProps {
  goals: FitnessGoal[];
  onSaveGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => void;
  onUpdateProgress: (goalId: string, current: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GOAL_TYPES = [
  { value: 'weight', label: 'Weight Goal', unit: 'kg', description: 'Target body weight' },
  { value: 'strength', label: 'Strength Goal', unit: 'kg', description: 'Target weight for specific exercise' },
  { value: 'endurance', label: 'Endurance Goal', unit: 'reps', description: 'Target reps for specific exercise' },
  { value: 'workout_frequency', label: 'Workout Frequency', unit: 'workouts/week', description: 'Target workouts per week' },
  { value: 'custom', label: 'Custom Goal', unit: '', description: 'Personal fitness goal' },
];

export const GoalSetting: React.FC<GoalSettingProps> = ({
  goals,
  onSaveGoal,
  onUpdateProgress,
  onDeleteGoal
}) => {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    type: 'weight' as FitnessGoal['type'],
    title: '',
    description: '',
    target: 0,
    unit: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Omit<FitnessGoal, 'id' | 'createdAt'> = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      target: formData.target,
      current: 0,
      unit: formData.unit || GOAL_TYPES.find(t => t.value === formData.type)?.unit || '',
      deadline: new Date(formData.deadline || new Date()),
      completed: false,
    };

    // Validate the goal
    const validationErrors = validateGoal(newGoal);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSaveGoal(newGoal);
    setShowForm(false);
    setFormData({
      type: 'weight',
      title: '',
      description: '',
      target: 0,
      unit: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handleTypeChange = (type: FitnessGoal['type']) => {
    const suggestion = getSuggestedGoal(type);
    setFormData(prev => ({
      ...prev,
      type,
      title: suggestion.title,
      description: suggestion.description,
      target: suggestion.target,
      unit: suggestion.unit || GOAL_TYPES.find(t => t.value === type)?.unit || ''
    }));
  };

  const getProgressPercentage = (goal: FitnessGoal) => {
    if (goal.target === 0) return 0;
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(percentage, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalTypeInfo = (type: string) => {
    return GOAL_TYPES.find(t => t.value === type);
  };

  // Enhanced goal validation
  const validateGoal = (goalData: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    const errors: string[] = [];
    
    if (goalData.target <= 0) {
      errors.push('Target value must be greater than 0');
    }
    
    if (goalData.deadline <= new Date()) {
      errors.push('Deadline must be in the future');
    }
    
    if (goalData.title.trim().length < 3) {
      errors.push('Goal title must be at least 3 characters long');
    }
    
    return errors;
  };

  // Auto-complete goal based on type
  const getSuggestedGoal = (type: FitnessGoal['type']) => {
    const suggestions = {
      weight: {
        title: 'Reach Target Weight',
        description: 'Achieve your target body weight through consistent diet and exercise',
        target: 70,
        unit: 'kg'
      },
      strength: {
        title: 'Improve Bench Press',
        description: 'Increase your bench press strength to reach your target weight',
        target: 100,
        unit: 'kg'
      },
      endurance: {
        title: 'Complete More Reps',
        description: 'Build endurance by increasing the number of reps you can perform',
        target: 20,
        unit: 'reps'
      },
      workout_frequency: {
        title: 'Workout More Often',
        description: 'Establish a consistent workout routine',
        target: 4,
        unit: 'workouts/week'
      },
      custom: {
        title: 'Custom Fitness Goal',
        description: 'Set your own personal fitness objective',
        target: 1,
        unit: ''
      }
    };
    
    return suggestions[type];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">🎯 Goal Management</h2>
          <p className="text-neutral-600">Set, track, and achieve your fitness objectives</p>
        </div>
        <Button
          title={showForm ? "✕ Cancel" : "➕ Add Goal"}
          variant={showForm ? "outline" : "accent"}
          onClick={() => setShowForm(!showForm)}
        />
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <Card variant="elevated" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">🎯 Create New Goal</h3>
              <p className="text-sm text-neutral-600">Set a specific, measurable fitness objective</p>
            </div>
            <div className="text-2xl">💪</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-danger-600">⚠️</span>
                  <h4 className="font-medium text-danger-800">Please fix the following errors:</h4>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-danger-700">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  🎯 Goal Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const type = e.target.value as FitnessGoal['type'];
                    handleTypeChange(type);
                  }}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                >
                  {GOAL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  📊 Target Value
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                  <span className="px-4 py-3 bg-neutral-100 text-neutral-600 rounded-lg font-medium">
                    {formData.unit}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                📝 Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Bench Press 100kg"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                📋 Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal in detail..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ⏰ Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                title="🎯 Auto-fill"
                variant="ghost"
                onClick={() => handleTypeChange(formData.type)}
                type="button"
                className="text-primary-600 hover:text-primary-700"
              />
              <div className="flex space-x-3">
                <Button
                  title="✕ Cancel"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  type="button"
                />
                <Button title="💾 Save Goal" variant="success" type="submit" />
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Goals Analytics */}
      {goals.length > 0 && (
        <Card variant="elevated" className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{goals.length}</div>
              <div className="text-sm text-neutral-600">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {goals.filter(g => g.completed || (g.current / g.target) >= 1).length}
              </div>
              <div className="text-sm text-neutral-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {goals.filter(g => !g.completed && getDaysRemaining(g.deadline) < 0).length}
              </div>
              <div className="text-sm text-neutral-600">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-600">
                {Math.round(goals.reduce((acc, goal) => acc + getProgressPercentage(goal), 0) / goals.length)}%
              </div>
              <div className="text-sm text-neutral-600">Avg Progress</div>
            </div>
          </div>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <Card variant="elevated" className="p-12 text-center">
            <div className="text-neutral-500">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No goals set yet</h3>
              <p className="mb-6 text-neutral-600">Set your first fitness goal to start tracking your progress!</p>
              <Button title="🎯 Add Your First Goal" variant="accent" onClick={() => setShowForm(true)} />
            </div>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;
            const isCompleted = goal.completed || progress >= 100;

            return (
              <Card 
                key={goal.id} 
                variant={isCompleted ? "success" : isOverdue ? "warning" : "elevated"}
                className="p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Goal Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">
                          {isCompleted ? '🏆' : isOverdue ? '⚠️' : '🎯'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900">{goal.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted ? 'bg-success-100 text-success-800' :
                            isOverdue ? 'bg-warning-100 text-warning-800' :
                            'bg-primary-100 text-primary-800'
                          }`}>
                            {isCompleted ? '✅ Completed' : isOverdue ? '⏰ Overdue' : '🔥 Active'}
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-600 text-sm ml-11">{goal.description}</p>
                    </div>
                    <Button
                      title="🗑️"
                      variant="ghost"
                      size="small"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-neutral-400 hover:text-danger-600"
                    />
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-700">
                        📊 Progress: {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className={`font-bold text-lg ${
                        isCompleted ? 'text-success-600' : 
                        isOverdue ? 'text-warning-600' : 
                        'text-primary-600'
                      }`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                          isCompleted ? 'bg-gradient-success' : 
                          isOverdue ? 'bg-gradient-warning' : 
                          'bg-gradient-primary'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Update Progress */}
                  {!isCompleted && (
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-neutral-700">📈 Update Progress:</span>
                        <input
                          type="number"
                          min="0"
                          max={goal.target}
                          value={goal.current}
                          onChange={(e) => onUpdateProgress(goal.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <span className="text-sm text-neutral-600 font-medium">{goal.unit}</span>
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-600">
                      <span className="font-medium">⏰ Deadline:</span> {goal.deadline.toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      {isOverdue && !isCompleted && (
                        <span className="text-warning-600 font-medium">
                          ⚠️ {Math.abs(daysRemaining)} days overdue
                        </span>
                      )}
                      {!isOverdue && !isCompleted && (
                        <span className={`font-medium ${
                          daysRemaining <= 7 ? 'text-warning-600' : 'text-neutral-600'
                        }`}>
                          {daysRemaining <= 7 ? '🔥' : '📅'} {daysRemaining} days remaining
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-success-600 font-medium">
                          ✅ Goal achieved!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}; 
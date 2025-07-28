import React, { useState } from 'react';
import { Card, Button, Select, Textarea, Alert, AlertTitle, AlertDescription, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@fitness-tracker/ui';

export interface FitnessGoal {
  id: string;
  type: 'weight' | 'strength' | 'endurance' | 'workout_frequency' | 'custom';
  category: 'fitness' | 'performance' | 'lifestyle' | 'competition';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
  milestones?: GoalMilestone[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  achieved: boolean;
  achievedAt?: Date;
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

const GOAL_CATEGORIES = [
  { value: 'fitness', label: '🏃‍♂️ Fitness', description: 'General fitness goals' },

  { value: 'performance', label: '⚡ Performance', description: 'Athletic performance goals' },
  { value: 'lifestyle', label: '🌱 Lifestyle', description: 'Lifestyle and habit goals' },
  { value: 'competition', label: '🏆 Competition', description: 'Competition and challenge goals' },
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: '🌱 Beginner', description: 'Suitable for beginners' },
  { value: 'intermediate', label: '🔥 Intermediate', description: 'For experienced users' },
  { value: 'advanced', label: '💪 Advanced', description: 'Challenging goals' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: '🟢 Low', description: 'Nice to have' },
  { value: 'medium', label: '🟡 Medium', description: 'Important' },
  { value: 'high', label: '🔴 High', description: 'Critical priority' },
];

const GOAL_TEMPLATES = [
  {
    id: 'weight-loss',
    title: 'Weight Loss Journey',
    description: 'Lose weight and improve overall health',
    type: 'weight' as FitnessGoal['type'],
    category: 'lifestyle' as FitnessGoal['category'],
    target: 70,
    unit: 'kg',
    difficulty: 'intermediate' as FitnessGoal['difficulty'],
    priority: 'high' as FitnessGoal['priority'],
    tags: ['weight loss', 'lifestyle', 'fitness'],
    deadline: 90, // days
  },
  {
    id: 'strength-building',
    title: 'Build Strength',
    description: 'Increase overall strength and muscle mass',
    type: 'strength' as FitnessGoal['type'],
    category: 'fitness' as FitnessGoal['category'],
    target: 100,
    unit: 'kg',
    difficulty: 'intermediate' as FitnessGoal['difficulty'],
    priority: 'medium' as FitnessGoal['priority'],
    tags: ['strength', 'muscle', 'fitness'],
    deadline: 60, // days
  },
  {
    id: 'endurance',
    title: 'Improve Endurance',
    description: 'Build cardiovascular endurance and stamina',
    type: 'endurance' as FitnessGoal['type'],
    category: 'performance' as FitnessGoal['category'],
    target: 30,
    unit: 'minutes',
    difficulty: 'beginner' as FitnessGoal['difficulty'],
    priority: 'medium' as FitnessGoal['priority'],
    tags: ['endurance', 'cardio', 'stamina'],
    deadline: 45, // days
  },
  {
    id: 'workout-habit',
    title: 'Build Workout Habit',
    description: 'Establish a consistent workout routine',
    type: 'workout_frequency' as FitnessGoal['type'],
    category: 'lifestyle' as FitnessGoal['category'],
    target: 4,
    unit: 'workouts/week',
    difficulty: 'beginner' as FitnessGoal['difficulty'],
    priority: 'high' as FitnessGoal['priority'],
    tags: ['habit', 'consistency', 'routine'],
    deadline: 30, // days
  },
];

export const GoalSetting: React.FC<GoalSettingProps> = ({
  goals,
  onSaveGoal,
  onUpdateProgress,
  onDeleteGoal
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'progress' | 'created'>('deadline');
  const [formData, setFormData] = useState({
    type: 'weight' as FitnessGoal['type'],
    category: 'fitness' as FitnessGoal['category'],
    title: '',
    description: '',
    target: 0,
    unit: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    difficulty: 'intermediate' as FitnessGoal['difficulty'],
    priority: 'medium' as FitnessGoal['priority'],
    tags: [] as string[],
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Omit<FitnessGoal, 'id' | 'createdAt'> = {
      type: formData.type,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      target: formData.target,
      current: 0,
      unit: formData.unit || GOAL_TYPES.find(t => t.value === formData.type)?.unit || '',
      deadline: new Date(formData.deadline || new Date()),
      completed: false,
      difficulty: formData.difficulty,
      priority: formData.priority,
      tags: formData.tags,
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
    // Reset form data after successful save
    setFormData({
      type: 'weight',
      category: 'fitness',
      title: '',
      description: '',
      target: 0,
      unit: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      difficulty: 'intermediate',
      priority: 'medium',
      tags: [],
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

  const applyTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + template.deadline);
    
    setFormData({
      type: template.type,
      category: template.category,
      title: template.title,
      description: template.description,
      target: template.target,
      unit: template.unit,
      deadline: deadline.toISOString().split('T')[0],
      difficulty: template.difficulty,
      priority: template.priority,
      tags: template.tags,
    });
    setShowForm(true);
    
    // Scroll to form after a short delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.querySelector('[data-testid="goal-form"]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const getProgressPercentage = (goal: FitnessGoal) => {
    if (goal.target === 0) return 0;
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(percentage, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };



  // Enhanced goal validation
  const validateGoal = (goalData: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    const errors: string[] = [];
    
    if (goalData.target <= 0) {
      errors.push('Target value must be greater than 0');
    }
    
    const deadlineDate = goalData.deadline instanceof Date ? goalData.deadline : new Date(goalData.deadline);
    if (deadlineDate <= new Date()) {
      errors.push('Deadline must be in the future');
    }
    
    if (goalData.title.trim().length < 3) {
      errors.push('Goal title must be at least 3 characters long');
    }
    
    return errors;
  };

  // Filter and sort goals
  const filteredAndSortedGoals = goals
    .filter(goal => {
      if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
      if (filterStatus !== 'all') {
        const isCompleted = goal.completed || (goal.current / goal.target) >= 1;
        if (filterStatus === 'completed' && !isCompleted) return false;
        if (filterStatus === 'active' && isCompleted) return false;
        if (filterStatus === 'overdue' && (isCompleted || getDaysRemaining(goal.deadline) >= 0)) return false;
      }
      if (filterPriority !== 'all' && goal.priority !== filterPriority) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline': {
          const deadlineA = a.deadline instanceof Date ? a.deadline : new Date(a.deadline);
          const deadlineB = b.deadline instanceof Date ? b.deadline : new Date(b.deadline);
          return deadlineA.getTime() - deadlineB.getTime();
        }
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'progress': {
          return getProgressPercentage(b) - getProgressPercentage(a);
        }
        case 'created': {
          const createdA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const createdB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return createdB.getTime() - createdA.getTime();
        }
        default:
          return 0;
      }
    });

  // Check for achievements
  const checkAchievements = () => {
    const achievements = [];
    const completedGoals = goals.filter(g => g.completed || (g.current / g.target) >= 1);
    
    if (completedGoals.length >= 1) {
      achievements.push({ id: 'first-goal', title: '🎯 First Goal', description: 'Completed your first goal!' });
    }
    if (completedGoals.length >= 5) {
      achievements.push({ id: 'goal-master', title: '🏆 Goal Master', description: 'Completed 5 goals!' });
    }
    if (completedGoals.length >= 10) {
      achievements.push({ id: 'goal-champion', title: '👑 Goal Champion', description: 'Completed 10 goals!' });
    }
    if (goals.filter(g => g.priority === 'high' && (g.completed || (g.current / g.target) >= 1)).length >= 3) {
      achievements.push({ id: 'priority-focus', title: '⚡ Priority Focus', description: 'Completed 3 high-priority goals!' });
    }
    if (goals.filter(g => g.difficulty === 'advanced' && (g.completed || (g.current / g.target) >= 1)).length >= 2) {
      achievements.push({ id: 'advanced-achiever', title: '💪 Advanced Achiever', description: 'Completed 2 advanced goals!' });
    }
    
    return achievements;
  };

  const achievements = checkAchievements();

  // Generate goal recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    // If no goals, recommend starting with basic goals
    if (goals.length === 0) {
      recommendations.push({
        id: 'start-fitness',
        title: 'Start Your Fitness Journey',
        description: 'Begin with a simple workout frequency goal',
        template: GOAL_TEMPLATES.find(t => t.id === 'workout-habit')!,
        reason: 'Perfect for beginners'
      });
    }
    
    // If mostly strength goals, recommend endurance
    const strengthGoals = goals.filter(g => g.type === 'strength');
    if (strengthGoals.length > 0 && goals.filter(g => g.type === 'endurance').length === 0) {
      recommendations.push({
        id: 'add-endurance',
        title: 'Add Endurance Training',
        description: 'Balance your strength training with cardio',
        template: GOAL_TEMPLATES.find(t => t.id === 'endurance')!,
        reason: 'Balance your fitness routine'
      });
    }
    

    
    return recommendations;
  };

  const recommendations = getRecommendations();

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
        <Card variant="elevated" className="p-8" data-testid="goal-form">
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
              <Alert variant="destructive">
                <AlertTitle>Please fix the following errors:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="🎯 Goal Type"
                  value={formData.type}
                  onChange={(value) => {
                    const type = value as FitnessGoal['type'];
                    handleTypeChange(type);
                  }}
                  options={GOAL_TYPES.map(type => ({
                    value: type.value,
                    label: type.label
                  }))}
                  placeholder="Select goal type"
                  required
                />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="🏷️ Category"
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value as FitnessGoal['category'] }))}
                  options={GOAL_CATEGORIES.map(cat => ({
                    value: cat.value,
                    label: cat.label
                  }))}
                  placeholder="Select category"
                  required
                />
              </div>

              <div>
                <Select
                  label="💪 Difficulty"
                  value={formData.difficulty}
                  onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as FitnessGoal['difficulty'] }))}
                  options={DIFFICULTY_LEVELS.map(diff => ({
                    value: diff.value,
                    label: diff.label
                  }))}
                  placeholder="Select difficulty"
                  required
                />
              </div>

              <div>
                <Select
                  label="⚡ Priority"
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value as FitnessGoal['priority'] }))}
                  options={PRIORITY_LEVELS.map(priority => ({
                    value: priority.value,
                    label: priority.label
                  }))}
                  placeholder="Select priority"
                  required
                />
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
              <Textarea
                label="📋 Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal in detail..."
                rows={3}
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                🏷️ Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                }))}
                placeholder="strength, upper body, personal best"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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

      {/* Filters and Sorting */}
      {goals.length > 0 && (
        <Card variant="elevated" className="p-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">🔍 Filter & Sort Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select
                  label="Category"
                  value={filterCategory}
                  onChange={(value) => setFilterCategory(value)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...GOAL_CATEGORIES.map(cat => ({
                      value: cat.value,
                      label: cat.label
                    }))
                  ]}
                  placeholder="Filter by category"
                />
              </div>
              <div>
                <Select
                  label="Status"
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'overdue', label: 'Overdue' }
                  ]}
                  placeholder="Filter by status"
                />
              </div>
              <div>
                <Select
                  label="Priority"
                  value={filterPriority}
                  onChange={(value) => setFilterPriority(value)}
                  options={[
                    { value: 'all', label: 'All Priorities' },
                    ...PRIORITY_LEVELS.map(priority => ({
                      value: priority.value,
                      label: priority.label
                    }))
                  ]}
                  placeholder="Filter by priority"
                />
              </div>
              <div>
                <Select
                  label="Sort By"
                  value={sortBy}
                  onChange={(value) => setSortBy(value as any)}
                  options={[
                    { value: 'deadline', label: 'Deadline' },
                    { value: 'priority', label: 'Priority' },
                    { value: 'progress', label: 'Progress' },
                    { value: 'created', label: 'Created Date' }
                  ]}
                  placeholder="Sort goals"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Alert variant="default" className="mb-6">
          <AlertTitle className="flex items-center gap-2">
            🏆 Achievements Unlocked! 🎉
          </AlertTitle>
          <AlertDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-3 bg-white/50 rounded-lg border border-yellow-200"
                >
                  <div className="text-lg font-bold mb-1">{achievement.title}</div>
                  <p className="text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Goal Recommendations */}
      {recommendations.length > 0 && (
        <Alert variant="default" className="mb-6">
          <AlertTitle className="flex items-center gap-2">
            💡 Personalized Recommendations 🤖
          </AlertTitle>
          <AlertDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-white/50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => applyTemplate(rec.template)}
                >
                  <div className="text-lg font-bold mb-1">{rec.title}</div>
                  <p className="text-sm mb-2">{rec.description}</p>
                  <div className="text-xs bg-blue-50 px-2 py-1 rounded">
                    💡 {rec.reason}
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Goal Templates */}
      <Card variant="elevated" className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">🚀 Quick Start Templates</h3>
          <p className="text-sm text-neutral-600">Choose a template to get started quickly</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GOAL_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer bg-white"
              onClick={() => applyTemplate(template)}
            >
              <div className="text-2xl mb-2">
                {template.category === 'fitness' ? '🏃‍♂️' :
                 template.category === 'performance' ? '⚡' :
                 template.category === 'lifestyle' ? '🌱' :
                 template.category === 'competition' ? '🏆' : '🎯'}
              </div>
              <h4 className="font-bold text-neutral-900 mb-1">{template.title}</h4>
              <p className="text-sm text-neutral-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{template.target} {template.unit}</span>
                <span>{template.deadline} days</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <Card variant="elevated" className="p-12 text-center rounded-3xl">
            <div className="text-neutral-500">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No goals set yet</h3>
              <p className="mb-6 text-neutral-600">Set your first fitness goal to start tracking your progress!</p>
              <Button title="🎯 Add Your First Goal" variant="accent" onClick={() => setShowForm(true)} />
            </div>
          </Card>
        ) : (
          filteredAndSortedGoals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;
            const isCompleted = goal.completed || progress >= 100;

            return (
              <Card 
                key={goal.id} 
                variant={isCompleted ? "success" : isOverdue ? "warning" : "elevated"}
                className="p-6 hover:shadow-xl transition-all duration-300 rounded-3xl"
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
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCompleted ? 'bg-success-100 text-success-800' :
                              isOverdue ? 'bg-warning-100 text-warning-800' :
                              'bg-primary-100 text-primary-800'
                            }`}>
                              {isCompleted ? '✅ Completed' : isOverdue ? '⏰ Overdue' : '🔥 Active'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                              goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {PRIORITY_LEVELS.find(p => p.value === goal.priority)?.label}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {GOAL_CATEGORIES.find(c => c.value === goal.category)?.label}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {DIFFICULTY_LEVELS.find(d => d.value === goal.difficulty)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-600 text-sm ml-11">{goal.description}</p>
                      {goal.tags && goal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 ml-11">
                          {goal.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      title="🗑️"
                      variant="ghost"
                      size="small"
                      onClick={() => {
                        setGoalToDelete(goal.id);
                        setShowDeleteDialog(true);
                      }}
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
                      <span className="font-medium">⏰ Deadline:</span> {(goal.deadline instanceof Date ? goal.deadline : new Date(goal.deadline)).toLocaleDateString()}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (goalToDelete) {
                  onDeleteGoal(goalToDelete);
                  setShowDeleteDialog(false);
                  setGoalToDelete(null);
                }
              }}
            >
              Delete Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
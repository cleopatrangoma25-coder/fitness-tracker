import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

export interface FitnessPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in weeks
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: 'strength' | 'cardio' | 'flexibility' | 'weight_loss' | 'muscle_gain' | 'general';
  phases: PlanPhase[];
  createdAt: Date;
  isActive: boolean;
}

export interface PlanPhase {
  id: string;
  name: string;
  duration: number; // in weeks
  description: string;
  goals: string[];
  exercises: PlanExercise[];
}

export interface PlanExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  daysPerWeek: number;
}

interface FitnessPlanProps {
  plans: FitnessPlan[];
  onSavePlan: (plan: Omit<FitnessPlan, 'id' | 'createdAt'>) => void;
  onUpdatePlan: (planId: string, plan: Partial<FitnessPlan>) => void;
  onDeletePlan: (planId: string) => void;
  onActivatePlan: (planId: string) => void;
}

export const FitnessPlan: React.FC<FitnessPlanProps> = ({
  plans,
  onSavePlan,
  onUpdatePlan,
  onDeletePlan,
  onActivatePlan
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FitnessPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 8,
    difficulty: 'beginner' as FitnessPlan['difficulty'],
    focus: 'strength' as FitnessPlan['focus'],
    phases: [] as PlanPhase[]
  });

  const [currentPhase, setCurrentPhase] = useState<PlanPhase>({
    id: '',
    name: '',
    duration: 4,
    description: '',
    goals: [''],
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState<PlanExercise>({
    id: '',
    name: '',
    sets: 3,
    reps: '8-12',
    rest: '2-3 min',
    daysPerWeek: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.phases.length === 0) {
      alert('Please add at least one phase to your plan');
      return;
    }

    const newPlan: Omit<FitnessPlan, 'id' | 'createdAt'> = {
      ...formData,
      isActive: false
    };

    onSavePlan(newPlan);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 8,
      difficulty: 'beginner',
      focus: 'strength',
      phases: []
    });
    setCurrentPhase({
      id: '',
      name: '',
      duration: 4,
      description: '',
      goals: [''],
      exercises: []
    });
    setCurrentExercise({
      id: '',
      name: '',
      sets: 3,
      reps: '8-12',
      rest: '2-3 min',
      daysPerWeek: 2
    });
  };

  const addPhase = () => {
    if (!currentPhase.name || !currentPhase.description) {
      alert('Please fill in phase name and description');
      return;
    }

    const newPhase: PlanPhase = {
      ...currentPhase,
      id: Math.random().toString(),
      goals: currentPhase.goals.filter(goal => goal.trim() !== '')
    };

    setFormData(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }));

    setCurrentPhase({
      id: '',
      name: '',
      duration: 4,
      description: '',
      goals: [''],
      exercises: []
    });
  };

  const addExercise = () => {
    if (!currentExercise.name) {
      alert('Please enter exercise name');
      return;
    }

    const newExercise: PlanExercise = {
      ...currentExercise,
      id: Math.random().toString()
    };

    setCurrentPhase(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));

    setCurrentExercise({
      id: '',
      name: '',
      sets: 3,
      reps: '8-12',
      rest: '2-3 min',
      daysPerWeek: 2
    });
  };

  const removePhase = (phaseIndex: number) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, index) => index !== phaseIndex)
    }));
  };

  const removeExercise = (exerciseIndex: number) => {
    setCurrentPhase(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }));
  };

  const addGoal = () => {
    setCurrentPhase(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setCurrentPhase(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeGoal = (index: number) => {
    setCurrentPhase(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus) {
      case 'strength': return 'bg-blue-100 text-blue-800';
      case 'cardio': return 'bg-red-100 text-red-800';
      case 'flexibility': return 'bg-purple-100 text-purple-800';
      case 'weight_loss': return 'bg-orange-100 text-orange-800';
      case 'muscle_gain': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">📋 Fitness Plans</h2>
          <p className="text-neutral-600">Create your own structured fitness programs</p>
        </div>
        <Button
          title={showForm ? "✕ Cancel" : "➕ Create Plan"}
          variant={showForm ? "outline" : "accent"}
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) resetForm();
          }}
        />
      </div>

      {/* Create Plan Form */}
      {showForm && (
        <Card variant="elevated" className="p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">🎯 Create Your Fitness Plan</h3>
              <p className="text-sm text-neutral-600">Design a personalized program to achieve your goals</p>
            </div>
            <div className="text-2xl">💪</div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Plan Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  📝 Plan Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., My Strength Journey"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  ⏱️ Duration (weeks)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 8 }))}
                  min="1"
                  max="52"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                📋 Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your fitness plan and what you want to achieve..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  🎯 Focus Area
                </label>
                <select
                  value={formData.focus}
                  onChange={(e) => setFormData(prev => ({ ...prev, focus: e.target.value as FitnessPlan['focus'] }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                >
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardiovascular Fitness</option>
                  <option value="flexibility">Flexibility & Mobility</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="general">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  📊 Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as FitnessPlan['difficulty'] }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Phases Section */}
            <div className="border-t border-neutral-200 pt-6">
              <h4 className="text-lg font-bold text-neutral-900 mb-4">📈 Plan Phases</h4>
              
              {/* Existing Phases */}
              {formData.phases.length > 0 && (
                <div className="space-y-4 mb-6">
                  {formData.phases.map((phase, index) => (
                    <div key={phase.id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-neutral-900">Phase {index + 1}: {phase.name}</h5>
                        <button
                          type="button"
                          onClick={() => removePhase(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{phase.description}</p>
                      <div className="text-sm text-neutral-600">
                        <strong>Duration:</strong> {phase.duration} weeks | 
                        <strong> Goals:</strong> {phase.goals.length} | 
                        <strong> Exercises:</strong> {phase.exercises.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Phase */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h5 className="font-medium text-neutral-900 mb-4">➕ Add New Phase</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phase Name</label>
                    <input
                      type="text"
                      value={currentPhase.name}
                      onChange={(e) => setCurrentPhase(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Foundation, Progression, Advanced"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Duration (weeks)</label>
                    <input
                      type="number"
                      value={currentPhase.duration}
                      onChange={(e) => setCurrentPhase(prev => ({ ...prev, duration: parseInt(e.target.value) || 4 }))}
                      min="1"
                      max="12"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Phase Description</label>
                  <textarea
                    value={currentPhase.description}
                    onChange={(e) => setCurrentPhase(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this phase focuses on..."
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Phase Goals */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-neutral-700">Phase Goals</label>
                    <button
                      type="button"
                      onClick={addGoal}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Goal
                    </button>
                  </div>
                  {currentPhase.goals.map((goal, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder="e.g., Master proper form"
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Phase Exercises */}
                <div className="mb-4">
                  <h6 className="font-medium text-neutral-900 mb-2">Exercises</h6>
                  
                  {/* Existing Exercises */}
                  {currentPhase.exercises.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {currentPhase.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="bg-white rounded-lg p-3 border border-neutral-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-neutral-900">{exercise.name}</div>
                              <div className="text-sm text-neutral-600">
                                {exercise.sets} sets × {exercise.reps} | Rest: {exercise.rest} | {exercise.daysPerWeek}x/week
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExercise(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Exercise */}
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Exercise Name</label>
                        <input
                          type="text"
                          value={currentExercise.name}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Squats, Push-ups"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Sets</label>
                        <input
                          type="number"
                          value={currentExercise.sets}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 3 }))}
                          min="1"
                          max="10"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Reps</label>
                        <input
                          type="text"
                          value={currentExercise.reps}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, reps: e.target.value }))}
                          placeholder="e.g., 8-12"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Rest</label>
                        <input
                          type="text"
                          value={currentExercise.rest}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, rest: e.target.value }))}
                          placeholder="e.g., 2-3 min"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Days/Week</label>
                        <input
                          type="number"
                          value={currentExercise.daysPerWeek}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, daysPerWeek: parseInt(e.target.value) || 2 }))}
                          min="1"
                          max="7"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addExercise}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      + Add Exercise
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPhase}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  + Add Phase
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
              <Button
                title="Cancel"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              />
              <Button
                title="Create Plan"
                variant="primary"
                type="submit"
              />
            </div>
          </form>
        </Card>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} variant="elevated" className="p-6 hover:shadow-lg transition-shadow rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-neutral-900">{plan.title}</h3>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                  {plan.difficulty}
                </span>
                {plan.isActive && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-neutral-600 text-sm mb-4">{plan.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFocusColor(plan.focus)}`}>
                {plan.focus}
              </span>
              <span className="text-sm text-neutral-500">{plan.duration} weeks</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm text-neutral-700">
                <strong>Phases:</strong> {plan.phases.length}
              </div>
              <div className="text-sm text-neutral-700">
                <strong>Total Exercises:</strong> {plan.phases.reduce((total, phase) => total + phase.exercises.length, 0)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!plan.isActive && (
                <Button
                  title="Activate"
                  variant="primary"
                  size="sm"
                  onClick={() => onActivatePlan(plan.id)}
                />
              )}
              <Button
                title="View"
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlan(plan)}
              />
              <Button
                title="Delete"
                variant="outline"
                size="sm"
                onClick={() => onDeletePlan(plan.id)}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <Card variant="elevated" className="p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">{selectedPlan.title}</h3>
              <p className="text-sm text-neutral-600">{selectedPlan.description}</p>
            </div>
            <Button
              title="✕ Close"
              variant="outline"
              onClick={() => setSelectedPlan(null)}
            />
          </div>
          
          <div className="space-y-6">
            {selectedPlan.phases.map((phase, index) => (
              <div key={phase.id} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold text-neutral-900">
                    Phase {index + 1}: {phase.name}
                  </h4>
                  <span className="text-sm text-neutral-500">{phase.duration} weeks</span>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4">{phase.description}</p>
                
                <div className="mb-4">
                  <h5 className="font-medium text-neutral-900 mb-2">Goals:</h5>
                  <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                    {phase.goals.map((goal, goalIndex) => (
                      <li key={goalIndex}>{goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-neutral-900 mb-2">Exercises:</h5>
                  <div className="space-y-2">
                    {phase.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-neutral-900">{exercise.name}</div>
                            <div className="text-sm text-neutral-600">
                              {exercise.sets} sets × {exercise.reps} | Rest: {exercise.rest}
                            </div>
                            {exercise.notes && (
                              <div className="text-sm text-neutral-500 mt-1">{exercise.notes}</div>
                            )}
                          </div>
                          <span className="text-sm text-neutral-500">{exercise.daysPerWeek}x/week</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}; 
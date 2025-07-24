import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@fitness-tracker/store';
import { GoalSetting, type FitnessGoal } from '../components/goals/GoalSetting';
import { FitnessPlan, type FitnessPlan as FitnessPlanType } from '../components/goals/FitnessPlan';
import { GoalsService } from '../lib/goals';
import { PlansService } from '../lib/plans';
import type { Goal } from '@fitness-tracker/shared';

// Helper function to convert Firebase Goal to UI FitnessGoal
const convertFirebaseGoalToUI = (firebaseGoal: Goal): FitnessGoal => {
  // Map goal type to category based on the type
  const getCategoryFromType = (type: string): FitnessGoal['category'] => {
    switch (type.toLowerCase()) {
      case 'weight':
        return 'health';
      case 'strength':
      case 'endurance':
        return 'fitness';
      case 'frequency':
        return 'lifestyle';
      default:
        return 'fitness';
    }
  };

  // Map goal type to difficulty based on target value
  const getDifficultyFromTarget = (type: string, target: number): FitnessGoal['difficulty'] => {
    switch (type.toLowerCase()) {
      case 'weight':
        return target > 100 ? 'advanced' : target > 50 ? 'intermediate' : 'beginner';
      case 'strength':
        return target > 150 ? 'advanced' : target > 100 ? 'intermediate' : 'beginner';
      case 'endurance':
        return target > 60 ? 'advanced' : target > 30 ? 'intermediate' : 'beginner';
      case 'frequency':
        return target > 5 ? 'advanced' : target > 3 ? 'intermediate' : 'beginner';
      default:
        return 'intermediate';
    }
  };

  // Map goal type to priority based on type and target
  const getPriorityFromType = (type: string, target: number): FitnessGoal['priority'] => {
    switch (type.toLowerCase()) {
      case 'weight':
        return target > 80 ? 'high' : 'medium';
      case 'strength':
        return target > 120 ? 'high' : 'medium';
      case 'endurance':
        return target > 45 ? 'high' : 'medium';
      case 'frequency':
        return target > 4 ? 'high' : 'medium';
      default:
        return 'medium';
    }
  };

  return {
    id: firebaseGoal.id,
    type: firebaseGoal.type.toLowerCase() as FitnessGoal['type'],
    category: getCategoryFromType(firebaseGoal.type),
    title: firebaseGoal.title,
    description: firebaseGoal.description || '',
    target: firebaseGoal.targetValue,
    current: firebaseGoal.currentValue,
    unit: firebaseGoal.unit,
    deadline: firebaseGoal.deadline || new Date(),
    completed: firebaseGoal.status === 'COMPLETED',
    createdAt: firebaseGoal.createdAt,
    difficulty: getDifficultyFromTarget(firebaseGoal.type, firebaseGoal.targetValue),
    priority: getPriorityFromType(firebaseGoal.type, firebaseGoal.targetValue),
    tags: [], // Default empty tags
  };
};

// Helper function to convert UI FitnessGoal to Firebase Goal
const convertUIGoalToFirebase = (uiGoal: Omit<FitnessGoal, 'id' | 'createdAt'>): Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    userId: '', // Will be set by the service
    type: uiGoal.type.toUpperCase() as Goal['type'],
    title: uiGoal.title,
    description: uiGoal.description,
    targetValue: uiGoal.target,
    currentValue: uiGoal.current,
    unit: uiGoal.unit,
    status: uiGoal.completed ? 'COMPLETED' : 'ACTIVE',
    startDate: new Date(),
    deadline: uiGoal.deadline,
  };
};

export default function GoalsPage() {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [plans, setPlans] = useState<FitnessPlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'goals' | 'plans'>('goals');

  // Load goals and plans from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          
          // Load goals from Firebase and convert to UI format
          const firebaseGoals = await GoalsService.getGoals(user.userId);
          const uiGoals = firebaseGoals.map(convertFirebaseGoalToUI);
          setGoals(uiGoals);
          
          // Load plans from Firebase
          const firebasePlans = await PlansService.getPlans(user.userId);
          setPlans(firebasePlans as FitnessPlanType[]);
          
        } catch (error) {
          console.error('Failed to load data from Firebase:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user?.userId]);

  const handleSaveGoal = async (goalData: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    if (!user?.userId) return;
    
    try {
      const firebaseGoalData = convertUIGoalToFirebase(goalData);
      const newGoal = await GoalsService.createGoal({
        ...firebaseGoalData,
        userId: user.userId,
      });
      const uiGoal = convertFirebaseGoalToUI(newGoal);
      setGoals(prev => [uiGoal, ...prev]);
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const handleUpdateProgress = async (goalId: string, current: number) => {
    try {
      const updatedGoal = await GoalsService.updateGoalProgress(goalId, current);
      const uiGoal = convertFirebaseGoalToUI(updatedGoal);
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? uiGoal : goal
      ));
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await GoalsService.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleSavePlan = async (planData: Omit<FitnessPlanType, 'id' | 'createdAt'>) => {
    if (!user?.userId) return;
    
    try {
      const newPlan = await PlansService.createPlan({
        ...planData,
        userId: user.userId,
      });
      setPlans(prev => [newPlan as FitnessPlanType, ...prev]);
    } catch (error) {
      console.error('Failed to save plan:', error);
    }
  };

  const handleUpdatePlan = async (planId: string, planData: Partial<FitnessPlanType>) => {
    try {
      const updatedPlan = await PlansService.updatePlan(planId, planData);
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? updatedPlan as FitnessPlanType : plan
      ));
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await PlansService.deletePlan(planId);
      setPlans(prev => prev.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  const handleActivatePlan = async (planId: string) => {
    if (!user?.userId) return;
    
    try {
      const activatedPlan = await PlansService.activatePlan(planId, user.userId);
      setPlans(prev => prev.map(plan => ({
        ...plan,
        isActive: plan.id === planId
      })));
    } catch (error) {
      console.error('Failed to activate plan:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to manage your fitness goals and plans.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your goals and plans...</p>
        </div>
      </div>
    );
  }

  const activePlan = plans.find(plan => plan.isActive);
  const totalPlans = plans.length;
  const activePlans = plans.filter(plan => plan.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-goals-50">
      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden bg-goals-pattern bg-repeat">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-6 w-36 h-36 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
              🎯 Your Fitness Journey
            </h1>
            <p className="text-xl text-white mb-6 drop-shadow-xl">
              Set goals, create plans, and achieve your fitness objectives
            </p>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">{goals.length}</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Total Goals</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  {goals.filter(g => g.completed || (g.current / g.target) >= 1).length}
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">Goals Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">{totalPlans}</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Fitness Plans</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">{activePlans}</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Active Plans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-neutral-200">
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'goals'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              🎯 Goals
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'plans'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              📋 Plans
            </button>
          </div>
        </div>

        {/* Active Plan Banner */}
        {activePlan && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🏃‍♂️</div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Active Plan: {activePlan.title}</h3>
                  <p className="text-green-700">{activePlan.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-green-600">
                      <strong>Duration:</strong> {activePlan.duration} weeks
                    </span>
                    <span className="text-sm text-green-600">
                      <strong>Focus:</strong> {activePlan.focus}
                    </span>
                    <span className="text-sm text-green-600">
                      <strong>Difficulty:</strong> {activePlan.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleActivatePlan('')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'goals' ? (
          <GoalSetting
            goals={goals}
            onSaveGoal={handleSaveGoal}
            onUpdateProgress={handleUpdateProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        ) : (
          <FitnessPlan
            plans={plans}
            onSavePlan={handleSavePlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            onActivatePlan={handleActivatePlan}
          />
        )}
      </div>
    </div>
  );
} 
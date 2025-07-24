import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@fitness-tracker/store';
import { GoalSetting, type FitnessGoal } from '../components/goals/GoalSetting';
import { FitnessPlan, type FitnessPlan as FitnessPlanType } from '../components/goals/FitnessPlan';

export default function GoalsPage() {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [plans, setPlans] = useState<FitnessPlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'goals' | 'plans'>('goals');

  // Load goals and plans from localStorage
  useEffect(() => {
    if (user?.userId) {
      // Load goals
      const savedGoals = localStorage.getItem(`goals_${user.userId}`);
      if (savedGoals) {
        try {
          const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
            ...goal,
            deadline: new Date(goal.deadline),
            createdAt: new Date(goal.createdAt)
          }));
          setGoals(parsedGoals);
        } catch (error) {
          // Failed to parse saved goals
        }
      }

      // Load plans
      const savedPlans = localStorage.getItem(`plans_${user.userId}`);
      if (savedPlans) {
        try {
          const parsedPlans = JSON.parse(savedPlans).map((plan: any) => ({
            ...plan,
            createdAt: new Date(plan.createdAt),
            phases: plan.phases.map((phase: any) => ({
              ...phase,
              id: phase.id || Math.random().toString()
            }))
          }));
          setPlans(parsedPlans);
        } catch (error) {
          // Failed to parse saved plans
        }
      }
      setLoading(false);
    }
  }, [user?.userId]);

  // Save goals to localStorage
  const saveGoals = (newGoals: FitnessGoal[]) => {
    if (user?.userId) {
      localStorage.setItem(`goals_${user.userId}`, JSON.stringify(newGoals));
    }
  };

  // Save plans to localStorage
  const savePlans = (newPlans: FitnessPlanType[]) => {
    if (user?.userId) {
      localStorage.setItem(`plans_${user.userId}`, JSON.stringify(newPlans));
    }
  };

  const handleSaveGoal = (goalData: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    const newGoal: FitnessGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleUpdateProgress = (goalId: string, current: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, current } : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleSavePlan = (planData: Omit<FitnessPlanType, 'id' | 'createdAt'>) => {
    const newPlan: FitnessPlanType = {
      ...planData,
      id: Date.now().toString(),
      createdAt: new Date(),
      phases: planData.phases.map(phase => ({
        ...phase,
        id: phase.id || Math.random().toString()
      }))
    };
    
    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    savePlans(updatedPlans);
  };

  const handleUpdatePlan = (planId: string, planData: Partial<FitnessPlanType>) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, ...planData } : plan
    );
    setPlans(updatedPlans);
    savePlans(updatedPlans);
  };

  const handleDeletePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
    savePlans(updatedPlans);
  };

  const handleActivatePlan = (planId: string) => {
    // Deactivate all other plans first
    const updatedPlans = plans.map(plan => ({
      ...plan,
      isActive: plan.id === planId
    }));
    setPlans(updatedPlans);
    savePlans(updatedPlans);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300">Please log in to manage your fitness goals and plans.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your goals and plans...</p>
        </div>
      </div>
    );
  }

  const activePlan = plans.find(plan => plan.isActive);
  const totalPlans = plans.length;
  const activePlans = plans.filter(plan => plan.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-goals-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';
import { WorkoutService } from '../lib/workout';
import { OnboardingFlow } from '../components/stacks/__index';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#0ea5e9', '#f97316', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    lastWorkout: null as Date | null,
    averageWorkoutsPerWeek: 0,
    longestStreak: 0,
    currentStreak: 0,
  });
  const [muscleGroupStats, setMuscleGroupStats] = useState<Array<{
    muscleGroup: string;
    count: number;
    percentage: number;
  }>>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{
    week: string;
    workouts: number;
    exercises: number;
    totalVolume: number;
  }>>([]);
  const [personalRecords, setPersonalRecords] = useState<Array<{
    exerciseName: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    lastAchieved: Date;
  }>>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [progressiveOverloadData, setProgressiveOverloadData] = useState<Array<{
    date: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        
        // Load all analytics data in parallel
        const [workoutStats, muscleStats, weeklyStats, records] = await Promise.all([
          WorkoutService.getWorkoutStats(user.userId),
          WorkoutService.getMuscleGroupStats(user.userId),
          WorkoutService.getWeeklyWorkoutData(user.userId, 8),
          WorkoutService.getPersonalRecords(user.userId),
        ]);

        setStats(workoutStats);
        setMuscleGroupStats(muscleStats);
        setWeeklyData(weeklyStats);
        setPersonalRecords(records);

        // Check if user is new (no workouts yet) and show onboarding
        if (workoutStats.totalWorkouts === 0) {
          const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.userId}`);
          if (!hasSeenOnboarding) {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.userId]);

  const handleOnboardingComplete = () => {
    if (user?.userId) {
      localStorage.setItem(`onboarding_${user.userId}`, 'completed');
    }
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    if (user?.userId) {
      localStorage.setItem(`onboarding_${user.userId}`, 'skipped');
    }
    setShowOnboarding(false);
  };

  const handleExerciseSelect = async (exerciseName: string) => {
    if (!user?.userId) return;
    
    setSelectedExercise(exerciseName);
    try {
      const data = await WorkoutService.getProgressiveOverloadData(user.userId, exerciseName, 12);
      setProgressiveOverloadData(data);
    } catch (error) {
      console.error('Failed to load progressive overload data:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  const daysSinceLastWorkout = stats.lastWorkout 
    ? Math.floor((new Date().getTime() - stats.lastWorkout.getTime()) / (24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-dashboard-50">
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden bg-dashboard-pattern bg-repeat rounded-3xl mx-4 mt-4 shadow-2xl">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60 rounded-3xl">
          <div 
            className="w-full h-full bg-cover bg-center rounded-3xl"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10 rounded-3xl">
          <div className="absolute top-6 right-6 w-36 h-36 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 bg-white/30 rounded-full floating floating-delay-2"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/30 rounded-full floating floating-delay-3"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white/30 rounded-full floating floating-delay-2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
                Welcome back, {user.displayName}! 💪
              </h1>
              <p className="text-xl text-white mb-6 drop-shadow-xl">
                Ready to crush your fitness goals today?
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.currentStreak}</div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Day Streak</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.totalWorkouts}</div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Total Workouts</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.thisWeek}</div>
                  <div className="text-sm text-white font-medium drop-shadow-md">This Week</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">
                    {daysSinceLastWorkout !== null ? daysSinceLastWorkout : '0'}
                  </div>
                  <div className="text-sm text-white font-medium drop-shadow-md">Days Since Last</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link to="/workout">
                <Button title="🚀 Start Workout" variant="accent" size="large" />
              </Link>
              <Link to="/goals">
                <Button title="🎯 View Goals" variant="outline" className="text-white border-white/40 hover:bg-white/10" />
              </Link>
              <Link to="/health">
                <Button title="🏥 Health Tracking" variant="outline" className="text-white border-white/40 hover:bg-white/10" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Streak */}
          <Card variant="accent" className="p-6 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-200 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">🔥</div>
                <div className="text-sm text-accent-700 font-medium">Current Streak</div>
              </div>
              <div className="text-4xl font-bold text-accent-700 mb-2">{stats.currentStreak}</div>
              <div className="text-sm text-accent-600">days</div>
              {stats.currentStreak > 0 && (
                <div className="mt-3 text-xs text-accent-600">
                  Keep it up! You're on fire! 🔥
                </div>
              )}
            </div>
          </Card>

          {/* Longest Streak */}
          <Card variant="success" className="p-6 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-success-200 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">🏆</div>
                <div className="text-sm text-success-700 font-medium">Longest Streak</div>
              </div>
              <div className="text-4xl font-bold text-success-700 mb-2">{stats.longestStreak}</div>
              <div className="text-sm text-success-600">days</div>
              {stats.currentStreak === stats.longestStreak && (
                <div className="mt-3 text-xs text-success-600">
                  New record! Amazing! 🎉
                </div>
              )}
            </div>
          </Card>

          {/* Average Workouts */}
          <Card variant="primary" className="p-6 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">📊</div>
                <div className="text-sm text-primary-700 font-medium">Avg per Week</div>
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">{stats.averageWorkoutsPerWeek}</div>
              <div className="text-sm text-primary-600">workouts</div>
              <div className="mt-3 text-xs text-primary-600">
                {stats.averageWorkoutsPerWeek >= 3 ? 'Excellent consistency! 💪' : 'Keep building momentum! 📈'}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card variant="elevated" className="p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">⚡ Quick Actions</h2>
                <p className="text-sm text-black">Access your most important features</p>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/workout" className="group">
                <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl border border-accent-200 hover:border-accent-300 transition-all duration-200 group-hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💪</div>
                    <div>
                      <div className="font-semibold text-accent-700">Start Workout</div>
                      <div className="text-sm text-accent-600">Begin your training</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/health" className="group">
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 hover:border-red-300 transition-all duration-200 group-hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏥</div>
                    <div>
                      <div className="font-semibold text-red-700">Health Tracking</div>
                      <div className="text-sm text-red-600">Monitor your health</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/goals" className="group">
                <div className="p-4 bg-gradient-to-br from-goals-50 to-goals-100 rounded-2xl border border-goals-200 hover:border-goals-300 transition-all duration-200 group-hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="font-semibold text-goals-700">View Goals</div>
                      <div className="text-sm text-goals-600">Track your progress</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/profile" className="group">
                <div className="p-4 bg-gradient-to-br from-profile-50 to-profile-100 rounded-2xl border border-profile-200 hover:border-profile-300 transition-all duration-200 group-hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👤</div>
                    <div>
                      <div className="font-semibold text-profile-700">Profile</div>
                      <div className="text-sm text-profile-600">Manage settings</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <Card variant="elevated" className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">📈 Weekly Progress</h2>
                <p className="text-sm text-black">Your workout activity over time</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    name="Workouts"
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="exercises" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    name="Exercises"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Muscle Group Distribution */}
          <Card variant="elevated" className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">💪 Muscle Group Focus</h2>
                <p className="text-sm text-black">Distribution of your training</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleGroupStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ muscleGroup, percentage }) => `${muscleGroup} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {muscleGroupStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Volume Chart */}
        {weeklyData.length > 0 && (
          <Card variant="elevated" className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">🏋️ Weekly Volume</h2>
                <p className="text-sm text-black">Total training volume over time</p>
              </div>
              <div className="text-2xl">💪</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="totalVolume" 
                    fill="url(#volumeGradient)" 
                    name="Total Volume"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Personal Records */}
        {personalRecords.length > 0 && (
          <Card variant="elevated" className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">🏆 Personal Records</h2>
                <p className="text-sm text-black">Your best performances</p>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalRecords.slice(0, 6).map((record, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-success-50 to-success-100 border border-success-200 rounded-xl hover:border-success-300 hover:shadow-md cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleExerciseSelect(record.exerciseName)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-success-800">{record.exerciseName}</div>
                    <div className="text-success-600">🥇</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Max Weight:</span>
                      <span className="font-medium">{record.maxWeight}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Max Reps:</span>
                      <span className="font-medium">{record.maxReps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Max Volume:</span>
                      <span className="font-medium">{record.maxVolume}</span>
                    </div>
                    <div className="text-xs text-black mt-2">
                      Last: {record.lastAchieved.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Progressive Overload Chart */}
        {selectedExercise && progressiveOverloadData.length > 0 && (
          <Card variant="elevated" className="p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">📈 Progressive Overload: {selectedExercise}</h2>
                <p className="text-sm text-black">Your strength progression over time</p>
              </div>
              <Button
                title="✕ Close"
                variant="ghost"
                size="small"
                onClick={() => {
                  setSelectedExercise('');
                  setProgressiveOverloadData([]);
                }}
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressiveOverloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="maxWeight" 
                    stackId="1" 
                    stroke="#0ea5e9" 
                    fill="url(#weightGradient)" 
                    name="Max Weight (kg)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="maxVolume" 
                    stackId="2" 
                    stroke="#f97316" 
                    fill="url(#volumeGradient)" 
                    name="Max Volume" 
                  />
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Quick Actions & Motivation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card variant="accent" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-accent-800">⚡ Quick Actions</h2>
                <p className="text-sm text-accent-700">Get started quickly</p>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
            <div className="space-y-3">
              <Link to="/workout">
                <Button title="💪 Start New Workout" variant="default" className="w-full justify-center" />
              </Link>
              <Link to="/goals">
                <Button title="🎯 Set New Goal" variant="outline" className="w-full justify-center border-accent-300 text-accent-700 hover:bg-accent-50" />
              </Link>
              <Link to="/profile">
                <Button title="👤 Update Profile" variant="ghost" className="w-full justify-center text-accent-700 hover:bg-accent-50" />
              </Link>
            </div>
          </Card>

          <Card variant="success" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-success-800">💪 Daily Motivation</h2>
                <p className="text-sm text-success-700">Stay inspired</p>
              </div>
              <div className="text-2xl">🌟</div>
            </div>
            <div className="space-y-4">
              <div className="bg-success-100 p-4 rounded-lg">
                <p className="text-success-800 font-medium italic">
                  "The only bad workout is the one that didn't happen."
                </p>
              </div>
              <div className="text-sm text-success-700">
                <p className="mb-2">Today's focus:</p>
                <ul className="space-y-1">
                  <li>• Stay consistent with your routine</li>
                  <li>• Push yourself a little further</li>
                  <li>• Celebrate your progress</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.lastWorkout && (
          <Card variant="elevated" className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">📅 Recent Activity</h2>
                <p className="text-sm text-black">Your latest workout</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-700 font-medium">Last Workout</p>
                  <p className="text-lg font-bold text-primary-800">
                    {stats.lastWorkout.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-primary-600">
                    {daysSinceLastWorkout === 0 ? 'Today!' : 
                     daysSinceLastWorkout === 1 ? 'Yesterday' : 
                     `${daysSinceLastWorkout} days ago`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl">💪</div>
                  <p className="text-sm text-primary-700">Keep it up!</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Goals Section */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
            {user.goals && user.goals.length > 0 ? (
              <div className="space-y-2">
                {user.goals.map((goal, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-900">{goal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black">
                <p>No goals set yet</p>
                <Link to="/profile">
                  <Button title="Set Your Goals" className="mt-3" />
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 
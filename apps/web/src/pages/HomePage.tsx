'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Logo } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';
import { WorkoutService } from '../lib/workout';
import { OnboardingFlow } from '../components/stacks/__index';

export default function HomePage() {
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
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      const userStats = await WorkoutService.getWorkoutStats(user!.userId);
      const recent = await WorkoutService.getUserWorkouts(user!.userId, 5);
      
      setStats(userStats);
      setRecentWorkouts(recent);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every workout brings you closer to your goals! 💪",
      "Consistency is the key to transformation! 🔥",
      "Your future self will thank you for today's effort! ⚡",
      "Small progress is still progress! Keep going! 🎯",
      "You're stronger than you think! 💪",
      "Today's effort is tomorrow's strength! 🏋️‍♂️"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-surface-50 to-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card variant="hero" className="text-center p-12 animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <Logo variant="full" size="xl" className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Welcome to Fitness Tracker
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Transform your fitness journey with our comprehensive tracking and planning tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glass" size="lg" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-surface-50 to-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow 
      isOpen={showOnboarding}
      onComplete={() => setShowOnboarding(false)} 
      onSkip={() => setShowOnboarding(false)}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-surface-50 to-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white relative overflow-hidden bg-dashboard-pattern bg-repeat">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-40">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-8 right-8 w-40 h-40 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/30 rounded-full floating floating-delay-2"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/30 rounded-full floating floating-delay-3"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/30 rounded-full floating floating-delay-2"></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
              {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Fitness Warrior'}! 👋
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up animation-delay-200">
              {getMotivationalMessage()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button variant="glass" size="lg" asChild>
                <Link to="/workout">Start Workout</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20" asChild>
                <Link to="/health">Health Tracking</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20" asChild>
                <Link to="/dashboard">View Progress</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card variant="surface" className="text-center p-6 animate-fade-in-up animation-delay-100">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {stats.totalWorkouts}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Workouts</div>
          </Card>
          
          <Card variant="surface" className="text-center p-6 animate-fade-in-up animation-delay-200">
            <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              {stats.thisWeek}
            </div>
            <div className="text-gray-600 dark:text-gray-400">This Week</div>
          </Card>
          
          <Card variant="surface" className="text-center p-6 animate-fade-in-up animation-delay-300">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
              {stats.currentStreak}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
          </Card>
          
          <Card variant="surface" className="text-center p-6 animate-fade-in-up animation-delay-400">
            <div className="text-3xl font-bold text-dashboard-600 dark:text-dashboard-400 mb-2">
              {stats.averageWorkoutsPerWeek.toFixed(1)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg/Week</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card variant="glassmorphism" interactive animated className="p-6 text-center">
            <div className="text-4xl mb-4">🏋️‍♂️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start Workout</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Choose from our curated workout templates</p>
            <Button variant="primary" asChild>
              <Link to="/workout">Get Started</Link>
            </Button>
          </Card>
          
          <Card variant="glassmorphism" interactive animated className="p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Set Goals</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Define and track your fitness objectives</p>
            <Button variant="success" asChild>
              <Link to="/goals">Create Goals</Link>
            </Button>
          </Card>
          
          <Card variant="glassmorphism" interactive animated className="p-6 text-center">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Health Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Monitor your health metrics and wellness</p>
            <Button variant="danger" asChild>
              <Link to="/health">Track Health</Link>
            </Button>
          </Card>
          
          <Card variant="glassmorphism" interactive animated className="p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View Progress</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Track your fitness journey over time</p>
            <Button variant="accent" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentWorkouts.length > 0 && (
          <Card variant="premium" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <Button variant="ghost" asChild>
                <Link to="/workout/history">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentWorkouts.slice(0, 3).map((workout, index) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {workout.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{workout.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-success-600 dark:text-success-400">
                      {workout.exercises?.length || 0} exercises
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {workout.duration || 'N/A'} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Motivation Section */}
        <Card variant="sunset" className="text-center p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
            Choose your perfect workout template and start your fitness journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-medium text-white">⚡ Quick Workouts</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-medium text-white">🏋️ Full Sessions</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-medium text-white">🎯 Goal-Focused</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
'use client';

import { Link } from 'react-router-dom';
import { Button, Card } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';
import { useState, useEffect } from 'react';
import { WorkoutService } from '../lib/workout';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    currentStreak: 0,
    lastWorkout: null as Date | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user?.userId) return;
      
      try {
        const stats = await WorkoutService.getWorkoutStats(user.userId);
        setUserStats({
          totalWorkouts: stats.totalWorkouts,
          thisWeek: stats.thisWeek,
          currentStreak: stats.currentStreak,
          lastWorkout: stats.lastWorkout,
        });
      } catch (error) {
        console.error('Failed to load user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadUserStats();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to crush your fitness goals today? 💪",
      "Your future self is counting on today's workout! 🎯",
      "Every rep brings you closer to your goals! 🔥",
      "Time to make today count! 🚀",
      "Your dedication is inspiring! Keep it up! ⭐",
      "Today's effort is tomorrow's strength! 💪",
      "You're building something amazing! 🏗️",
      "Consistency beats perfection every time! 🎯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getDaysSinceLastWorkout = () => {
    if (!userStats.lastWorkout) return null;
    const days = Math.floor((new Date().getTime() - userStats.lastWorkout.getTime()) / (24 * 60 * 60 * 1000));
    return days;
  };

  const getStreakMessage = () => {
    if (userStats.currentStreak === 0) return "Start your streak today!";
    if (userStats.currentStreak === 1) return "Great start! Keep it going!";
    if (userStats.currentStreak < 7) return `Amazing ${userStats.currentStreak}-day streak!`;
    if (userStats.currentStreak < 30) return `Incredible ${userStats.currentStreak}-day streak!`;
    return `Legendary ${userStats.currentStreak}-day streak! 🔥`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-dashboard-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden bg-dashboard-pattern bg-repeat">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-40 h-40 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/30 rounded-full floating floating-delay-2"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/30 rounded-full floating floating-delay-3"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/30 rounded-full floating floating-delay-2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
              💪 Fitness Tracker
            </h1>
            <p className="text-xl lg:text-2xl text-white mb-8 drop-shadow-xl max-w-3xl mx-auto">
              Track your workouts, monitor progress, and achieve your fitness goals with our comprehensive fitness tracking platform
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30 shadow-lg">
                <div className="text-4xl mb-4 text-white drop-shadow-lg">📊</div>
                <div className="text-lg text-white font-bold drop-shadow-md mb-2">Track Progress</div>
                <div className="text-sm text-white drop-shadow-md">Monitor your fitness journey with detailed analytics and insights</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30 shadow-lg">
                <div className="text-4xl mb-4 text-white drop-shadow-lg">🎯</div>
                <div className="text-lg text-white font-bold drop-shadow-md mb-2">Set Goals</div>
                <div className="text-sm text-white drop-shadow-md">Create personalized fitness goals and track your achievements</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30 shadow-lg">
                <div className="text-4xl mb-4 text-white drop-shadow-lg">🏋️</div>
                <div className="text-lg text-white font-bold drop-shadow-md mb-2">Build Strength</div>
                <div className="text-sm text-white drop-shadow-md">Follow structured workout plans and build lasting strength</div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard">
                    <Button title="🚀 Go to Dashboard" variant="accent" size="large" />
                  </Link>
                  <Link to="/workout">
                    <Button title="💪 Start Workout" variant="outline" className="text-white border-white/40 hover:bg-white/10" size="large" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button title="🚀 Get Started" variant="accent" size="large" />
                  </Link>
                  <Link to="/auth">
                    <Button title="🔐 Sign In" variant="outline" className="text-white border-white/40 hover:bg-white/10" size="large" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {isAuthenticated && user ? (
          <div className="space-y-8">
            {/* Welcome Back Hero */}
            <div className="text-center mb-12 welcome-hero">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6">
                <span className="text-3xl motivational-icon">👋</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                {getGreeting()}, {user.displayName}!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                {getMotivationalMessage()}
              </p>
              {userStats.currentStreak > 0 && (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium mt-4 streak-badge">
                  🔥 {getStreakMessage()}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 welcome-stats">
                <Card className="p-6 text-center stats-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalWorkouts}</div>
                  <div className="text-gray-600 dark:text-gray-400">Total Workouts</div>
                </Card>
                <Card className="p-6 text-center stats-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.thisWeek}</div>
                  <div className="text-gray-600 dark:text-gray-400">This Week</div>
                </Card>
                <Card className="p-6 text-center stats-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.currentStreak}</div>
                  <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 welcome-actions">
              <Link to="/workout">
                <Card className="p-6 text-center quick-action-card cursor-pointer bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700 transition-colors duration-300">
                  <div className="text-4xl mb-4">💪</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Start Workout</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Begin your training session</p>
                </Card>
              </Link>
              <Link to="/dashboard">
                <Card className="p-6 text-center quick-action-card cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 transition-colors duration-300">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">View Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check your analytics</p>
                </Card>
              </Link>
              <Link to="/goals">
                <Card className="p-6 text-center quick-action-card cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 transition-colors duration-300">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manage Goals</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set and track objectives</p>
                </Card>
              </Link>
              <Link to="/profile">
                <Card className="p-6 text-center quick-action-card cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700 transition-colors duration-300">
                  <div className="text-4xl mb-4">👤</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Update Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your settings</p>
                </Card>
              </Link>
            </div>

            {/* Recent Activity & Motivation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card className="p-6 welcome-activity bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                  <span className="text-2xl mr-2">📈</span>
                  Recent Activity
                </h3>
                {userStats.lastWorkout ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">💪</div>
                        <div>
                          <div className="font-medium text-gray-900">Last Workout</div>
                          <div className="text-sm text-gray-600">
                            {userStats.lastWorkout.toLocaleDateString()} at {userStats.lastWorkout.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {getDaysSinceLastWorkout()} days ago
                        </div>
                      </div>
                    </div>
                    {getDaysSinceLastWorkout() && getDaysSinceLastWorkout()! > 3 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">⚠️</span>
                          <span className="text-yellow-800 font-medium">Time for a workout!</span>
                        </div>
                        <p className="text-yellow-700 text-sm mt-1">
                          It's been {getDaysSinceLastWorkout()} days since your last workout. Ready to get back on track?
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Start?</h4>
                    <p className="text-gray-600 mb-4">Begin your fitness journey with your first workout!</p>
                    <Link to="/workout">
                      <Button title="Start First Workout" variant="accent" />
                    </Link>
                  </div>
                )}
              </Card>

              {/* Motivation & Tips */}
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-700 welcome-motivation transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                  <span className="text-2xl mr-2">💡</span>
                  Today's Motivation
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <div className="text-lg font-medium text-gray-900 mb-2">
                      Consistency is Key
                    </div>
                    <p className="text-gray-700 text-sm">
                      Small, consistent efforts compound into massive results over time. 
                      Every workout, no matter how small, moves you closer to your goals.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/30 rounded-lg">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs font-medium text-gray-700">Set Clear Goals</div>
                    </div>
                    <div className="text-center p-3 bg-white/30 rounded-lg">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-xs font-medium text-gray-700">Track Progress</div>
                    </div>
                    <div className="text-center p-3 bg-white/30 rounded-lg">
                      <div className="text-2xl mb-1">🔥</div>
                      <div className="text-xs font-medium text-gray-700">Stay Consistent</div>
                    </div>
                    <div className="text-center p-3 bg-white/30 rounded-lg">
                      <div className="text-2xl mb-1">💪</div>
                      <div className="text-xs font-medium text-gray-700">Push Limits</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Start Section */}
            <Card className="p-8 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 welcome-quick-start transition-colors duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                What would you like to do today?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/workout">
                  <Button title="💪 Start Workout" variant="accent" size="large" />
                </Link>
                <Link to="/dashboard">
                  <Button title="📊 View Dashboard" variant="outline" size="large" />
                </Link>
                <Link to="/goals">
                  <Button title="🎯 Manage Goals" variant="ghost" size="large" />
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                Why Choose Fitness Tracker?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Smart Goal Setting</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Set personalized fitness goals and track your progress with intelligent insights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Detailed Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Get comprehensive analytics and visualizations of your fitness journey</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🏋️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Workout Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Log your workouts, track exercises, and monitor your strength progression</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌟</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Motivation & Support</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Stay motivated with progress tracking, streaks, and achievement celebrations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Card className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Start?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Join thousands of users who are already achieving their fitness goals
                  </p>
                  <div className="space-y-3">
                    <Link to="/auth">
                      <Button title="🚀 Get Started" size="large" />
                    </Link>
                    <Link to="/auth">
                      <Button title="🔐 Sign In" variant="outline" size="large" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
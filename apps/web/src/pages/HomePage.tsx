'use client';

import { Link } from 'react-router-dom';
import { Button, Card } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-dashboard-50">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isAuthenticated && user ? (
          <div className="text-center">
            <Card className="max-w-md mx-auto p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {user.displayName}! 👋
                </h2>
                <p className="text-gray-600 mb-6">
                  Ready to continue your fitness journey?
                </p>
                <div className="space-y-3">
                  <Link to="/dashboard">
                    <Button title="📊 View Dashboard" className="w-full" />
                  </Link>
                  <Link to="/workout">
                    <Button title="💪 Start Workout" variant="outline" className="w-full" />
                  </Link>
                  <Link to="/goals">
                    <Button title="🎯 Manage Goals" variant="ghost" className="w-full" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Fitness Tracker?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Goal Setting</h3>
                    <p className="text-gray-600">Set personalized fitness goals and track your progress with intelligent insights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
                    <p className="text-gray-600">Get comprehensive analytics and visualizations of your fitness journey</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🏋️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Workout Tracking</h3>
                    <p className="text-gray-600">Log your workouts, track exercises, and monitor your strength progression</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌟</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Motivation & Support</h3>
                    <p className="text-gray-600">Stay motivated with progress tracking, streaks, and achievement celebrations</p>
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
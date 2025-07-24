'use client';

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@fitness-tracker/store';
import { AuthService } from '../../lib/auth';
import { ThemeToggle } from '../ui/ThemeToggle';
import { HStack } from '@fitness-tracker/ui';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First, sign out from Firebase
      await AuthService.signOut();
      
      // Then clear local state
      logout();
      
      // Finally, redirect to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if Firebase logout fails, clear local state and redirect
      logout();
      navigate('/auth');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FT</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Fitness Tracker</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                  : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/workout"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/workout')
                  ? 'text-workout-600 bg-workout-50 dark:text-workout-400 dark:bg-workout-900/20'
                  : 'text-gray-700 hover:text-workout-600 dark:text-gray-300 dark:hover:text-workout-400'
              }`}
            >
              💪 Workouts
            </Link>
            <Link
              to="/goals"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/goals')
                  ? 'text-goals-600 bg-goals-50 dark:text-goals-400 dark:bg-goals-900/20'
                  : 'text-gray-700 hover:text-goals-600 dark:text-gray-300 dark:hover:text-goals-400'
              }`}
            >
              🎯 Goals
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-profile-600 bg-profile-50 dark:text-profile-400 dark:bg-profile-900/20'
                  : 'text-gray-700 hover:text-profile-600 dark:text-gray-300 dark:hover:text-profile-400'
              }`}
            >
              👤 Profile
            </Link>
          </div>

          {/* Right Side - Theme Toggle and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
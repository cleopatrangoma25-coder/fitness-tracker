'use client';

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@fitness-tracker/store';
import { AuthService } from '../../lib/auth';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '@fitness-tracker/ui';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
            <Link to="/dashboard" className="flex items-center">
              <Logo variant="text" size="md" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
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
              to="/health"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/health')
                  ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                  : 'text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
              }`}
            >
              🏥 Health
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
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors hidden md:block"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/workout"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/workout')
                  ? 'text-workout-600 bg-workout-50 dark:text-workout-400 dark:bg-workout-900/20'
                  : 'text-gray-700 hover:text-workout-600 hover:bg-workout-50 dark:text-gray-300 dark:hover:text-workout-400 dark:hover:bg-workout-900/20'
              }`}
            >
              💪 Workouts
            </Link>
            <Link
              to="/goals"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/goals')
                  ? 'text-goals-600 bg-goals-50 dark:text-goals-400 dark:bg-goals-900/20'
                  : 'text-gray-700 hover:text-goals-600 hover:bg-goals-50 dark:text-gray-300 dark:hover:text-goals-400 dark:hover:bg-goals-900/20'
              }`}
            >
              🎯 Goals
            </Link>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-profile-600 bg-profile-50 dark:text-profile-400 dark:bg-profile-900/20'
                  : 'text-gray-700 hover:text-profile-600 hover:bg-profile-50 dark:text-gray-300 dark:hover:text-profile-400 dark:hover:bg-profile-900/20'
              }`}
            >
              👤 Profile
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {user.displayName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleSignOut();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors rounded-md"
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
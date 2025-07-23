'use client';

import { Link } from 'react-router-dom';
import { useAuthStore } from '@fitness-tracker/store';
import { Button } from '@fitness-tracker/ui';

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900">
              Fitness Tracker
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/workout" className="text-gray-600 hover:text-gray-900">
                Workouts
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hi, {user.displayName}</span>
            <Button title="Logout" variant="outline" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
} 
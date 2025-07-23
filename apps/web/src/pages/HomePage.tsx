'use client';

import { Link } from 'react-router-dom';
import { Button, Card } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fitness Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Track your workouts, monitor progress, and achieve your fitness goals
          </p>
          
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-gray-600">Welcome back, {user.displayName}!</p>
              </div>
              <Link to="/dashboard">
                <Button title="Go to Dashboard" size="large" />
              </Link>
              <Link to="/workout">
                <Button 
                  title="Start Workout" 
                  variant="outline" 
                  size="large" 
                />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/auth">
                <Button title="Get Started" size="large" />
              </Link>
              <Link to="/auth">
                <Button 
                  title="Sign In" 
                  variant="outline" 
                  size="large" 
                />
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 
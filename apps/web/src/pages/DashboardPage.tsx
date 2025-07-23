'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    lastWorkout: null as Date | null,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from Firestore
    // For now, using placeholder data
    setStats({
      totalWorkouts: 12,
      thisWeek: 3,
      thisMonth: 8,
      lastWorkout: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });
  }, []);

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.displayName}!</p>
            </div>
            <div className="flex space-x-3">
              <Link to="/profile">
                <Button title="Profile" variant="outline" />
              </Link>
              <Link to="/workout">
                <Button title="Start Workout" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalWorkouts}</div>
              <div className="text-sm text-gray-600">Total Workouts</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.thisWeek}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.thisMonth}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.lastWorkout ? '2' : '0'}
              </div>
              <div className="text-sm text-gray-600">Days Since Last</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/workout">
                <Button title="Start New Workout" className="w-full justify-center" />
              </Link>
              <Link to="/workout/history">
                <Button title="View Workout History" variant="outline" className="w-full justify-center" />
              </Link>
              <Link to="/profile">
                <Button title="Edit Profile" variant="outline" className="w-full justify-center" />
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats.lastWorkout ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Last Workout</div>
                    <div className="text-sm text-gray-600">
                      {stats.lastWorkout.toLocaleDateString()}
                    </div>
                  </div>
                  <Link to="/workout/history">
                    <Button title="View" size="small" variant="outline" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No workouts yet</p>
                  <Link to="/workout">
                    <Button title="Start Your First Workout" className="mt-3" />
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

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
              <div className="text-center py-8 text-gray-500">
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
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Progress, Badge } from '@fitness-tracker/ui';
import { useWorkouts } from '../hooks/useWorkouts';
import { useGoals } from '../hooks/useGoals';
import { useProfile } from '../hooks/useProfile';

export default function DashboardPage() {
  const { workouts } = useWorkouts();
  const { goals } = useGoals();
  const { profile } = useProfile();

  // Calculate stats from real data
  const stats = {
    totalWorkouts: profile?.totalWorkouts || 0,
    thisWeek: workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    }).length,
    totalCalories: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
    streak: profile?.currentStreak || 0
  };

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const weeklyGoal = 5;
  const weeklyProgress = (stats.thisWeek / weeklyGoal) * 100;

  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.filter(g => !g.completed).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">Keep up the great work on your fitness journey</p>
        </div>
        <Button variant="primary">Start Workout</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
              </div>
              <div className="text-2xl">💪</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
              <div className="text-2xl">📅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calories Burned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCalories.toLocaleString()}</p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Goals: {activeGoals}</span>
                <Badge variant="default">{activeGoals}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed Goals: {completedGoals}</span>
                <Badge variant="success">{completedGoals}</Badge>
              </div>
              {activeGoals > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round((completedGoals / (activeGoals + completedGoals)) * 100)}%</span>
                  </div>
                  <Progress value={(completedGoals / (activeGoals + completedGoals)) * 100} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Weekly Goal: {stats.thisWeek}/{weeklyGoal} workouts</span>
                <Badge variant={weeklyProgress >= 100 ? "success" : "default"}>
                  {Math.round(weeklyProgress)}%
                </Badge>
              </div>
              <Progress value={weeklyProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏋️‍♂️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
                <p className="text-gray-600 mb-4">Start your fitness journey by logging your first workout!</p>
                <Button>Log Your First Workout</Button>
              </div>
            ) : (
              recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {workout.type === 'cardio' ? '🏃‍♂️' : 
                       workout.type === 'strength' ? '💪' : 
                       workout.type === 'flexibility' ? '🧘‍♀️' : '⚡'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">
                        {workout.duration} min • {workout.calories} calories
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
            {recentWorkouts.length > 0 && (
              <Button variant="outline" className="w-full">View All Workouts</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
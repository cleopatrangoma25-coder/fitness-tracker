'use client';

import { Card, Button } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function WorkoutPage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Workouts</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Start a Workout</h2>
        <p className="text-gray-600 mb-6">
          Track your exercises, sets, and reps to monitor your progress.
        </p>
        <Button title="Start New Workout" size="large" />
      </Card>
    </div>
  );
} 
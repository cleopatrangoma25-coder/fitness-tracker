'use client';

import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@fitness-tracker/store';
import { WorkoutLog } from '../components/workout/WorkoutLog';
import { ActiveWorkout } from '../components/workout/ActiveWorkout';
import { WorkoutHistory } from '../components/workout/WorkoutHistory';
import { WorkoutDetail } from '../components/workout/WorkoutDetail';
import { FullPageLoading } from '@fitness-tracker/ui';

export default function WorkoutPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <FullPageLoading text="Authenticating..." />;
  }

  if (!user) {
    return <FullPageLoading text="Loading user data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/80 via-orange-50/70 to-red-50/80 bg-workout-pattern bg-repeat relative">
      {/* Hero Background Image */}
      <div className="absolute inset-0 opacity-60">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
                          backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<WorkoutLog />} />
          <Route path="/active" element={<ActiveWorkout />} />
          <Route path="/active/:workoutId" element={<ActiveWorkout />} />
          <Route path="/history" element={<WorkoutHistory />} />
          <Route path="/:workoutId" element={<WorkoutDetail />} />
        </Routes>
      </div>
    </div>
  );
} 
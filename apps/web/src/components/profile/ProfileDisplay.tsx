'use client';

import { useState } from 'react';
import { Button, Card } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';
import { ProfileForm } from './ProfileForm';

export function ProfileDisplay() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home or auth page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl">
        <div className="text-center">
          <p className="text-black">Please sign in to view your profile.</p>
        </div>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Button
          title="Cancel"
          variant="outline"
          onClick={() => setIsEditing(false)}
        />
        <ProfileForm />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <Card variant="elevated" className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">{user.displayName}</h2>
          <p className="text-neutral-600 text-lg">{user.email}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {user.role.toLowerCase()}
            </span>
            <span className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium">
              {user.fitnessLevel?.toLowerCase() || 'Not set'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">👤</div>
              <h3 className="text-xl font-bold text-neutral-900">Personal Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-500 mb-1">📝 Full Name</h4>
                <p className="text-neutral-900 font-medium">{user.firstName} {user.lastName}</p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-500 mb-1">📧 Email</h4>
                <p className="text-neutral-900 font-medium">{user.email}</p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-500 mb-1">📅 Member Since</h4>
                <p className="text-neutral-900 font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Fitness Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">💪</div>
              <h3 className="text-xl font-bold text-neutral-900">Fitness Information</h3>
            </div>
            
            <div className="space-y-4">
              {user.height && (
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
                  <h4 className="text-sm font-medium text-primary-700 mb-1">📏 Height</h4>
                  <p className="text-primary-900 font-bold text-lg">{user.height} cm</p>
                </div>
              )}
              
              {user.weight && (
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-lg border border-accent-200">
                  <h4 className="text-sm font-medium text-accent-700 mb-1">⚖️ Weight</h4>
                  <p className="text-accent-900 font-bold text-lg">{user.weight} kg</p>
                </div>
              )}
              
              {user.fitnessLevel && (
                <div className="bg-gradient-to-r from-success-50 to-success-100 p-4 rounded-lg border border-success-200">
                  <h4 className="text-sm font-medium text-success-700 mb-1">🏃‍♂️ Fitness Level</h4>
                  <p className="text-success-900 font-bold text-lg capitalize">{user.fitnessLevel.toLowerCase()}</p>
                </div>
              )}
              
              {!user.height && !user.weight && !user.fitnessLevel && (
                <div className="bg-neutral-50 p-4 rounded-lg text-center">
                  <p className="text-neutral-600">No fitness information set yet</p>
                  <p className="text-sm text-neutral-500 mt-1">Add your details to get personalized recommendations</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Goals Section */}
        {user.goals && user.goals.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">🎯</div>
              <h3 className="text-xl font-bold text-neutral-900">Fitness Goals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.goals.map((goal, index) => (
                <div key={index} className="bg-gradient-to-r from-success-50 to-success-100 p-4 rounded-lg border border-success-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-success-600">🎯</span>
                    <span className="text-success-900 font-medium">{goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Section */}
        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">⚙️</div>
            <h3 className="text-xl font-bold text-neutral-900">Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-500 mb-1">📏 Units</h4>
              <p className="text-neutral-900 font-medium">
                {user.preferences?.units === 'METRIC' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)'}
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-500 mb-1">🔔 Notifications</h4>
              <p className="text-neutral-900 font-medium">
                {user.preferences?.notifications ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-500 mb-1">🔒 Privacy</h4>
              <p className="text-neutral-900 font-medium capitalize">
                {user.preferences?.privacy?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            title="✏️ Edit Profile"
            variant="accent"
            onClick={() => setIsEditing(true)}
            className="flex-1"
          />
          <Button
            title="🚪 Sign Out"
            variant="outline"
            onClick={handleLogout}
            className="flex-1"
          />
        </div>
      </Card>
    </div>
  );
} 
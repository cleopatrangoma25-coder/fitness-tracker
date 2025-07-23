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
          <p className="text-gray-600">Please sign in to view your profile.</p>
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
    <div className="space-y-6">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="text-gray-900 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>

          {user.height && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Height</h3>
              <p className="text-gray-900">{user.height} cm</p>
            </div>
          )}

          {user.weight && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Weight</h3>
              <p className="text-gray-900">{user.weight} kg</p>
            </div>
          )}

          {user.fitnessLevel && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fitness Level</h3>
              <p className="text-gray-900 capitalize">{user.fitnessLevel.toLowerCase()}</p>
            </div>
          )}

          {user.goals && user.goals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Goals</h3>
              <ul className="text-gray-900">
                {user.goals.map((goal, index) => (
                  <li key={index}>• {goal}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Preferences</h3>
            <div className="space-y-1">
              <p className="text-gray-900">
                Units: {user.preferences?.units === 'METRIC' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)'}
              </p>
              <p className="text-gray-900">
                Notifications: {user.preferences?.notifications ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-gray-900">
                Privacy: {user.preferences?.privacy?.toLowerCase()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
            <p className="text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <Button
            title="Edit Profile"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex-1"
          />
          <Button
            title="Sign Out"
            variant="secondary"
            onClick={handleLogout}
            className="flex-1"
          />
        </div>
      </Card>
    </div>
  );
} 
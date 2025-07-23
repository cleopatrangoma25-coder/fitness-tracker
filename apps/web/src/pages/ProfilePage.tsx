'use client';

import { Card, Button } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <p className="mt-1 text-gray-900">{user.displayName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-gray-900">{user.createdAt?.toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
} 
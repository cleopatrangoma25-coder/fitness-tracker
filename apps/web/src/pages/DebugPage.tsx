'use client';

import { Card } from '@fitness-tracker/ui';
import { useAuthStore } from '@fitness-tracker/store';

export default function DebugPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? user.displayName : 'None'}</p>
        </div>
      </Card>
    </div>
  );
} 
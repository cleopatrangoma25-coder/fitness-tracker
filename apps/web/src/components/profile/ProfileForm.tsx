'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@fitness-tracker/ui';
import { UpdateProfileSchema, type UpdateProfileInput } from '@fitness-tracker/shared';
import { AuthService } from '@/lib/auth';
import { useAuthStore } from '@fitness-tracker/store';

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      height: user?.height || undefined,
      weight: user?.weight || undefined,
      fitnessLevel: user?.fitnessLevel || undefined,
      goals: user?.goals || [],
      preferences: {
        units: user?.preferences?.units || 'METRIC',
        notifications: user?.preferences?.notifications ?? true,
        privacy: user?.preferences?.privacy || 'PRIVATE',
      },
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await AuthService.updateUserProfile(user.userId, data);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
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

  return (
    <Card className="w-full max-w-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-gray-600 mt-2">Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            {...(errors.firstName?.message && { error: errors.firstName.message })}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            {...(errors.lastName?.message && { error: errors.lastName.message })}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Display Name"
          placeholder="JohnDoe"
          {...(errors.displayName?.message && { error: errors.displayName.message })}
          {...register('displayName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            placeholder="175"
            {...(errors.height?.message && { error: errors.height.message })}
            {...register('height', { valueAsNumber: true })}
          />
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="70"
            {...(errors.weight?.message && { error: errors.weight.message })}
            {...register('weight', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Fitness Level
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('fitnessLevel')}
          >
            <option value="">Select fitness level</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Units
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('preferences.units')}
          >
            <option value="METRIC">Metric (kg, cm)</option>
            <option value="IMPERIAL">Imperial (lbs, ft)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('preferences.notifications')}
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
            Receive notifications
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}

        <Button
          title={isLoading ? 'Updating Profile...' : 'Update Profile'}
          type="submit"
          disabled={isLoading}
          className="w-full"
        />
      </form>
    </Card>
  );
} 
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
    <Card variant="elevated" className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="text-3xl">✏️</div>
          <h2 className="text-3xl font-bold text-neutral-900">Edit Profile</h2>
        </div>
        <p className="text-neutral-600 text-lg">Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">👤</div>
            <h3 className="text-xl font-bold text-neutral-900">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📝 First Name"
              placeholder="John"
              {...(errors.firstName?.message && { error: errors.firstName.message })}
              {...register('firstName')}
            />
            <Input
              label="📝 Last Name"
              placeholder="Doe"
              {...(errors.lastName?.message && { error: errors.lastName.message })}
              {...register('lastName')}
            />
          </div>

          <Input
            label="🏷️ Display Name"
            placeholder="JohnDoe"
            {...(errors.displayName?.message && { error: errors.displayName.message })}
            {...register('displayName')}
          />
        </div>

        {/* Fitness Information Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">💪</div>
            <h3 className="text-xl font-bold text-neutral-900">Fitness Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="📏 Height (cm)"
              type="number"
              placeholder="175"
              {...(errors.height?.message && { error: errors.height.message })}
              {...register('height', { valueAsNumber: true })}
            />
            <Input
              label="⚖️ Weight (kg)"
              type="number"
              placeholder="70"
              {...(errors.weight?.message && { error: errors.weight.message })}
              {...register('weight', { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="block text-neutral-700 text-sm font-medium mb-2">
              🏃‍♂️ Fitness Level
            </label>
            <select
              className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              {...register('fitnessLevel')}
            >
              <option value="">Select fitness level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">⚙️</div>
            <h3 className="text-xl font-bold text-neutral-900">Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 text-sm font-medium mb-2">
                📏 Units
              </label>
              <select
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                {...register('preferences.units')}
              >
                <option value="METRIC">Metric (kg, cm)</option>
                <option value="IMPERIAL">Imperial (lbs, ft)</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3 bg-neutral-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="notifications"
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                {...register('preferences.notifications')}
              />
              <label htmlFor="notifications" className="block text-sm text-neutral-900 font-medium">
                🔔 Receive notifications
              </label>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="text-danger-600 text-sm bg-danger-50 p-4 rounded-lg border border-danger-200">
            <div className="flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="text-success-600 text-sm bg-success-50 p-4 rounded-lg border border-success-200">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="submit"
            variant="success"
            disabled={isLoading}
            className="px-8 py-3">
          isLoading ? '⏳ Updating Profile...' : '💾 Save Changes'
        </Button>
        </div>
      </form>
    </Card>
  );
} 
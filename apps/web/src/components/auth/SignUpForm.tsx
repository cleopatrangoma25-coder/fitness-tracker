'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@fitness-tracker/ui';
import { SignUpSchema, type SignUpInput } from '@fitness-tracker/shared';
import { AuthService } from '@/lib/auth';
import { useAuthStore } from '@fitness-tracker/store';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.signUp(data);
      setUser(user);
      // Redirect to dashboard after successful sign up
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      
      // If it's an email-already-in-use error, provide additional guidance
      if (errorMessage.includes('already exists')) {
        // The error message will be displayed, and we can add a suggestion
        setTimeout(() => {
          setError(errorMessage + ' You can try signing in with your existing account.');
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join Fitness Tracker to start your journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          {...(errors.email?.message && { error: errors.email.message })}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...(errors.password?.message && { error: errors.password.message })}
          {...register('password')}
        />

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          title="Create Account"
          type="submit"
          isLoading={isLoading}
          className="w-full"
        />

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
} 
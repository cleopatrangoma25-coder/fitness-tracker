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
    <Card variant="elevated" className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="text-3xl">✨</div>
          <h2 className="text-3xl font-bold text-neutral-900">Create Account</h2>
        </div>
        <p className="text-neutral-600 text-lg">Join Fitness Tracker to start your journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="👤 First Name"
            placeholder="John"
            {...(errors.firstName?.message && { error: errors.firstName.message })}
            {...register('firstName')}
          />
          <Input
            label="👤 Last Name"
            placeholder="Doe"
            {...(errors.lastName?.message && { error: errors.lastName.message })}
            {...register('lastName')}
          />
        </div>

        {/* Display Name */}
        <Input
          label="🏷️ Display Name"
          placeholder="JohnDoe"
          {...(errors.displayName?.message && { error: errors.displayName.message })}
          {...register('displayName')}
        />

        {/* Email */}
        <Input
          label="📧 Email Address"
          type="email"
          placeholder="john@example.com"
          {...(errors.email?.message && { error: errors.email.message })}
          {...register('email')}
        />

        {/* Password */}
        <Input
          label="🔒 Password"
          type="password"
          placeholder="••••••••"
          {...(errors.password?.message && { error: errors.password.message })}
          {...register('password')}
        />

        {/* Status Messages */}
        {error && (
          <div className="text-danger-600 text-sm bg-danger-50 p-4 rounded-lg border border-danger-200">
            <div className="flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          title={isLoading ? '⏳ Creating Account...' : '🚀 Create Account'}
          type="submit"
          variant="accent"
          disabled={isLoading}
          className="w-full py-4 text-lg font-bold"
        />

        {/* Action Links */}
        <div className="text-center text-sm">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              🔐 Sign In
            </button>
          </p>
        </div>

        {/* Social Sign-Up Options */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            className="flex items-center justify-center space-x-3 w-full px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">🔍</span>
            <span className="font-medium text-neutral-700">Sign up with Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center space-x-3 w-full px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <span className="text-xl">📘</span>
            <span className="font-medium text-neutral-700">Sign up with Facebook</span>
          </button>
        </div>
      </form>
    </Card>
  );
} 
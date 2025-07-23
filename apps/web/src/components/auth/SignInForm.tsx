'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@fitness-tracker/ui';
import { SignInSchema, type SignInInput } from '@fitness-tracker/shared';
import { AuthService } from '@/lib/auth';
import { useAuthStore } from '@fitness-tracker/store';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.signIn(data);
      setUser(user);
      // Redirect to dashboard after successful sign in
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.sendPasswordReset(email);
      setError('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your Fitness Tracker account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className={`text-sm p-3 rounded-lg ${
            error.includes('sent!') 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {error}
          </div>
        )}

        <Button
          type="submit"
          title="Sign In"
          isLoading={isLoading}
          className="w-full"
        />

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </button>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-blue-600 hover:text-blue-500"
          >
            Create account
          </button>
        </div>
      </form>
    </Card>
  );
} 
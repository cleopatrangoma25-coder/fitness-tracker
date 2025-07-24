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
    <Card variant="elevated" className="w-full max-w-lg mx-auto shadow-2xl border-0">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="text-4xl">🔐</div>
          <h2 className="text-4xl font-bold text-neutral-900">Welcome Back</h2>
        </div>
        <p className="text-neutral-600 text-xl">Sign in to continue your fitness journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Email Input */}
        <div className="space-y-3">
          <Input
            label="📧 Email Address"
            type="email"
            placeholder="john@example.com"
            {...(errors.email?.message && { error: errors.email.message })}
            {...register('email')}
            className="text-lg"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <Input
            label="🔒 Password"
            type="password"
            placeholder="••••••••"
            {...(errors.password?.message && { error: errors.password.message })}
            {...register('password')}
            className="text-lg"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className={`text-base p-5 rounded-xl border-2 ${
            error.includes('sent!') 
              ? 'text-success-600 bg-success-50 border-success-200' 
              : 'text-danger-600 bg-danger-50 border-danger-200'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="text-xl">{error.includes('sent!') ? '✅' : '❌'}</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          title={isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
          variant="primary"
          disabled={isLoading}
          className="w-full py-5 text-xl font-bold rounded-xl"
        />

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6 text-base">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            🔑 Forgot password?
          </button>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
          >
            ✨ Create account
          </button>
        </div>

        {/* Social Sign-In Options */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-base">
            <span className="px-4 bg-white text-neutral-500 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            className="flex items-center justify-center space-x-4 w-full px-6 py-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-lg font-medium"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-neutral-700">Continue with Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center space-x-4 w-full px-6 py-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-lg font-medium"
          >
            <span className="text-2xl">📘</span>
            <span className="text-neutral-700">Continue with Facebook</span>
          </button>
        </div>
      </form>
    </Card>
  );
} 
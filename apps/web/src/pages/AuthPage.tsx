'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen h-full w-full bg-gradient-to-br from-neutral-50 to-dashboard-50 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <div className="w-full bg-black text-white relative overflow-hidden bg-dashboard-pattern bg-repeat flex-shrink-0">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=20&contrast=10")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-40 h-40 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
              💪 Fitness Tracker
            </h1>
            <p className="text-xl text-white mb-6 drop-shadow-xl">
              Your journey to a healthier, stronger you starts here
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl mb-2 text-white drop-shadow-lg">📊</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Track Progress</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl mb-2 text-white drop-shadow-lg">🎯</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Set Goals</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 shadow-lg">
                <div className="text-2xl mb-2 text-white drop-shadow-lg">🏋️</div>
                <div className="text-sm text-white font-medium drop-shadow-md">Build Strength</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms - Centered */}
      <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {isSignUp ? (
            <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
          ) : (
            <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
          )}
        </div>
      </div>
    </div>
  );
} 
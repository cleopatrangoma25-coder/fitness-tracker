'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-50 to-dashboard-50 flex flex-col">
      {/* Hero Section - Compact */}
      <div className="bg-black text-white relative overflow-hidden bg-dashboard-pattern bg-repeat flex-shrink-0 w-full">
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
          <div className="absolute top-8 right-8 w-40 h-40 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/30 rounded-full floating floating-delay-2"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/30 rounded-full floating floating-delay-3"></div>
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/30 rounded-full floating floating-delay-2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-2xl">
              💪 Fitness Tracker
            </h1>
            <p className="text-base text-white mb-3 drop-shadow-xl">
              Your journey to a healthier, stronger you starts here
            </p>
            
            {/* Feature Highlights - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-lg">
                <div className="text-lg mb-1 text-white drop-shadow-lg">📊</div>
                <div className="text-xs text-white font-medium drop-shadow-md">Track Progress</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-lg">
                <div className="text-lg mb-1 text-white drop-shadow-lg">🎯</div>
                <div className="text-xs text-white font-medium drop-shadow-md">Set Goals</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-lg">
                <div className="text-lg mb-1 text-white drop-shadow-lg">🏋️</div>
                <div className="text-xs text-white font-medium drop-shadow-md">Build Strength</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms - Perfectly Centered with More Space */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="w-full max-w-xl mx-auto">
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
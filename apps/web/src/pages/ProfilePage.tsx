'use client';

import { useAuthStore } from '@fitness-tracker/store';
import { ProfileDisplay } from '../components/stacks/__index';
import { NotificationSettingsComponent } from '../components/stacks/__index';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-profile-50">
      {/* Hero Section */}
      <div className="bg-black text-white relative overflow-hidden bg-profile-pattern bg-repeat mx-4 mt-4 rounded-3xl">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80&auto=format&sat=15&contrast=8")'
            }}
          ></div>
        </div>
        
        {/* Background Illustrations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-6 w-36 h-36 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 bg-white/30 rounded-full floating floating-delay-2"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/30 rounded-full floating floating-delay-3"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/30 rounded-full floating floating-delay-1"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white/30 rounded-full floating floating-delay-2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
              👤 Your Profile
            </h1>
            <p className="text-xl text-white mb-6 drop-shadow-xl">
              Manage your fitness journey and personal preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileDisplay />
          <NotificationSettingsComponent />
        </div>
      </div>
    </div>
  );
} 
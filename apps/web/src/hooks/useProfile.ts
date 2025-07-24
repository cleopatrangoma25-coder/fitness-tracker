import { useState, useEffect } from 'react';
import { useProfileStore, type UserProfile } from '@fitness-tracker/store';

// Real API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/profile/user1`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/profile/user1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    
    return response.json();
  },

  updatePreferences: async (preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/profile/user1/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update preferences');
    }
    
    return response.json();
  },

  updateStats: async (stats: { totalWorkouts?: number; achievements?: number; currentStreak?: number }): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/profile/user1/stats`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update stats');
    }
    
    return response.json();
  }
};

export const useProfile = () => {
  const { profile, setProfile, setLoading, setError } = useProfileStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await api.getProfile();
        setProfile(data);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setProfile, setLoading, setError]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setIsUpdating(true);
    try {
      const updatedProfile = await api.updateProfile(updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    setIsUpdating(true);
    try {
      const updatedProfile = await api.updatePreferences(preferences);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStats = async (stats: { totalWorkouts?: number; achievements?: number; currentStreak?: number }) => {
    setIsUpdating(true);
    try {
      const updatedProfile = await api.updateStats(stats);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    updateProfile,
    updatePreferences,
    updateStats,
    isUpdating,
  };
}; 
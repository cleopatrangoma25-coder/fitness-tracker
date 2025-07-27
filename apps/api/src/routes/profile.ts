import { Router } from 'express';
import { z } from 'zod';
import { ProfileFormSchema, SettingsFormSchema } from '@fitness-tracker/shared';

const router: Router = Router();

// In-memory storage (replace with database in production)
const profiles: any[] = [
  {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'JohnDoe',
    email: 'john.doe@example.com',
    height: 175,
    weight: 75,
    age: 28,
    fitnessLevel: 'intermediate',
    bio: 'Passionate about fitness and staying healthy. My goal is to maintain a consistent workout routine and improve my overall fitness level.',
    joinDate: '2024-01-01',
    totalWorkouts: 24,
    achievements: 5,
    currentStreak: 7,
    preferences: {
      units: 'metric',
      notifications: {
        workoutReminders: true,
        goalUpdates: true,
        achievements: true,
        weeklyReports: true,
      },
    },
  }
];

// Get user profile
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = profiles.find(p => p.id === userId);
  
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  // Simulate API delay
  setTimeout(() => {
    res.json(profile);
  }, 500);
  
  return;
});

// Update user profile
router.put('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const validatedData = ProfileFormSchema.parse(req.body);
    
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...validatedData,
    };
    
    return res.json(profiles[profileIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update user preferences
router.patch('/:userId/preferences', (req, res) => {
  try {
    const { userId } = req.params;
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const validatedData = SettingsFormSchema.parse(req.body);
    
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      preferences: {
        ...profiles[profileIndex].preferences,
        ...validatedData,
      },
    };
    
    return res.json(profiles[profileIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update user statistics
router.patch('/:userId/stats', (req, res) => {
  try {
    const { userId } = req.params;
    const { totalWorkouts, achievements, currentStreak } = req.body;
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      totalWorkouts: totalWorkouts || profiles[profileIndex].totalWorkouts,
      achievements: achievements || profiles[profileIndex].achievements,
      currentStreak: currentStreak || profiles[profileIndex].currentStreak,
    };
    
    return res.json(profiles[profileIndex]);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
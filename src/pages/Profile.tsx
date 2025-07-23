import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Textarea, Avatar, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Alert, AlertTitle, AlertDescription } from '@fitness-tracker/ui';
import { useProfile } from '../hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileFormSchema, SettingsFormSchema, type ProfileFormData, type SettingsFormData } from '@fitness-tracker/shared';

export default function ProfilePage() {
  const { profile, updateProfile, updatePreferences, isUpdating } = useProfile();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      displayName: profile?.displayName || '',
      email: profile?.email || '',
      age: profile?.age || 25,
      height: profile?.height || 170,
      weight: profile?.weight || 70,
      fitnessLevel: profile?.fitnessLevel || 'intermediate',
      bio: profile?.bio || '',
    },
  });

  const {
    register: registerSettings,
    handleSubmit: handleSettingsSubmit,
    reset: resetSettings,
    formState: { errors: settingsErrors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      units: profile?.preferences?.units || 'metric',
      notifications: {
        workoutReminders: profile?.preferences?.notifications?.workoutReminders ?? true,
        goalUpdates: profile?.preferences?.notifications?.goalUpdates ?? true,
        achievements: profile?.preferences?.notifications?.achievements ?? true,
        weeklyReports: profile?.preferences?.notifications?.weeklyReports ?? true,
      },
    },
  });

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const units = [
    { value: 'metric', label: 'Metric (kg, cm)' },
    { value: 'imperial', label: 'Imperial (lbs, ft)' }
  ];

  const notificationSettings = [
    { value: 'workoutReminders', label: 'Workout Reminders' },
    { value: 'goalUpdates', label: 'Goal Updates' },
    { value: 'achievements', label: 'Achievement Notifications' },
    { value: 'weeklyReports', label: 'Weekly Progress Reports' }
  ];

  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-blue-600';
      case 'advanced': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getFitnessLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🔥';
      case 'advanced': return '💪';
      default: return '🏃‍♂️';
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setShowEditDialog(false);
      resetProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const onSettingsSubmit = async (data: SettingsFormData) => {
    try {
      await updatePreferences(data);
      setShowSettingsDialog(false);
      resetSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading profile...</h3>
          <p className="text-gray-600">Please wait while we load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            Settings
          </Button>
          <Button onClick={() => setShowEditDialog(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.displayName} />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                  )}
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                <p className="text-gray-600">@{profile.displayName}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Badge variant="outline" className={getFitnessLevelColor(profile.fitnessLevel)}>
                    {getFitnessLevelBadge(profile.fitnessLevel)} {profile.fitnessLevel}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{profile.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">{profile.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{profile.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Bio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{profile.totalWorkouts}</div>
                <p className="text-sm text-gray-600">Total Workouts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{profile.achievements}</div>
                <p className="text-sm text-gray-600">Achievements</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">{profile.currentStreak}</div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600">🏆</div>
                  <div>
                    <p className="font-medium text-green-900">Achievement Unlocked!</p>
                    <p className="text-sm text-green-700">Completed 20 workouts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">💪</div>
                  <div>
                    <p className="font-medium text-blue-900">Workout Logged</p>
                    <p className="text-sm text-blue-700">Strength Training - 45 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-600">🎯</div>
                  <div>
                    <p className="font-medium text-purple-900">Goal Updated</p>
                    <p className="text-sm text-purple-700">Weight goal: 75kg → 73kg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and fitness details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...registerProfile('firstName')}
                error={profileErrors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...registerProfile('lastName')}
                error={profileErrors.lastName?.message}
              />
            </div>
            <Input
              label="Display Name"
              {...registerProfile('displayName')}
              error={profileErrors.displayName?.message}
            />
            <Input
              label="Email"
              type="email"
              {...registerProfile('email')}
              error={profileErrors.email?.message}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Age"
                type="number"
                {...registerProfile('age', { valueAsNumber: true })}
                error={profileErrors.age?.message}
              />
              <Input
                label="Height (cm)"
                type="number"
                {...registerProfile('height', { valueAsNumber: true })}
                error={profileErrors.height?.message}
              />
              <Input
                label="Weight (kg)"
                type="number"
                {...registerProfile('weight', { valueAsNumber: true })}
                error={profileErrors.weight?.message}
              />
            </div>
            <Select
              label="Fitness Level"
              {...registerProfile('fitnessLevel')}
              options={fitnessLevels}
              placeholder="Select fitness level"
              error={profileErrors.fitnessLevel?.message}
            />
            <Textarea
              label="Bio"
              {...registerProfile('bio')}
              rows={3}
              error={profileErrors.bio?.message}
            />

            {Object.keys(profileErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Please fix the following errors:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.values(profileErrors).map((error, index) => (
                      <li key={index} className="text-sm">{error?.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  resetProfile();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account preferences and notification settings.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Preferences</h3>
              <Select
                label="Measurement Units"
                {...registerSettings('units')}
                options={units}
                placeholder="Select units"
                error={settingsErrors.units?.message}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Notifications</h3>
              <div className="space-y-2">
                {notificationSettings.map((setting) => (
                  <div key={setting.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={setting.value}
                      {...registerSettings(`notifications.${setting.value}` as any)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={setting.value} className="text-sm">
                      {setting.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(settingsErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Please fix the following errors:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {Object.values(settingsErrors).map((error, index) => (
                      <li key={index} className="text-sm">{error?.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowSettingsDialog(false);
                  resetSettings();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
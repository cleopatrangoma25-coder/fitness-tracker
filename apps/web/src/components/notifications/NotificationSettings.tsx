import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox } from '@fitness-tracker/ui';
import { notificationService } from '../../lib/notifications';

type NotificationPermission = 'default' | 'granted' | 'denied';

type NotificationSettings = {
  workoutReminders: boolean;
  goalUpdates: boolean;
  achievements: boolean;
  weeklyReports: boolean;
  dailyMotivation: boolean;
  mealReminders: boolean;
  stepGoals: boolean;
};

export const NotificationSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    workoutReminders: true,
    goalUpdates: true,
    achievements: true,
    weeklyReports: true,
    dailyMotivation: true,
    mealReminders: false,
    stepGoals: true
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutTime] = useState('18:00');
  const [workoutDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

  useEffect(() => {
    loadSettings();
    checkNotificationSupport();
  }, []);

  const loadSettings = () => {
    const savedSettings = notificationService.getNotificationSettings();
    setSettings(savedSettings);
    setPermissionStatus(notificationService.getPermissionStatus());
    setIsSupported(notificationService.isNotificationSupported());
  };

  const checkNotificationSupport = () => {
    setIsSupported(notificationService.isNotificationSupported());
    setPermissionStatus(notificationService.getPermissionStatus());
  };

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setPermissionStatus('granted');
        // Test notification
        notificationService.testNotification();
      } else {
        setPermissionStatus(notificationService.getPermissionStatus());
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionStatus(notificationService.getPermissionStatus());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await notificationService.updateNotificationSettings(newSettings);
  };

  const handleTestNotification = () => {
    notificationService.testNotification();
  };

  const handleWorkoutReminderTest = () => {
    const reminder = notificationService.createWorkoutReminder(workoutTime, workoutDays);
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  };

  const handleGoalReminderTest = () => {
    const goalReminder = {
      goalId: 'test-goal',
      goalTitle: 'Lose 5kg',
      currentProgress: 3,
      targetProgress: 5,
      reminderThreshold: 80,
      message: 'You\'re 60% to your goal! Keep up the great work!'
    };
    
    const reminder = notificationService.createGoalReminder(goalReminder);
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type, goalId: reminder.goalId }
    });
  };

  const handleStepGoalTest = () => {
    const reminder = notificationService.createStepGoalReminder(8500, 10000);
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  };

  const handleMotivationTest = () => {
    const reminder = notificationService.createMotivationReminder();
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  };

  const handleMealReminderTest = () => {
    const reminder = notificationService.createMealReminder('lunch');
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  };

  const handleDebugTest = () => {
    const testResult = notificationService.testNotificationSupport();
    console.log('Notification Support Test:', testResult);
    
    if (testResult.issues.length > 0) {
      alert(`Notification Issues Found:\n\n${testResult.issues.join('\n')}`);
    } else {
      alert('✅ All notification requirements are met!');
    }
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted': return '✅ Granted';
      case 'denied': return '❌ Denied';
      default: return '⚠️ Not Set';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔔 Notification Settings</h2>
            <p className="text-gray-600 dark:text-gray-300">Configure your notification preferences</p>
          </div>
          <div className="text-3xl">📱</div>
        </div>

        {/* Permission Status */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Notification Permission</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Status: <span className={`font-medium ${getPermissionStatusColor()}`}>
                  {getPermissionStatusText()}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isSupported ? '✅ Notifications supported' : '❌ Notifications not supported'}
              </p>
              {!isSupported && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                  <p>• Notification API: {'Notification' in window ? '✅ Available' : '❌ Not available'}</p>
                  <p>• Service Worker: {'serviceWorker' in navigator ? '✅ Available' : '❌ Not available'}</p>
                  <p>• Secure Context: {window.isSecureContext ? '✅ HTTPS/secure' : '❌ HTTP/insecure'}</p>
                </div>
              )}
              {isSupported && permissionStatus === 'default' && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  💡 Click "Enable Notifications" to start receiving notifications
                </p>
              )}
              {isSupported && permissionStatus === 'denied' && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  ⚠️ Notifications were denied. Please enable them in your browser settings.
                </p>
              )}
              {isSupported && permissionStatus === 'denied' && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-medium mb-2">How to enable notifications:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click the lock/info icon in your browser's address bar</li>
                    <li>Find "Notifications" in the site settings</li>
                    <li>Change from "Block" to "Allow"</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>
              )}
            </div>
            {permissionStatus !== 'granted' && (
              <Button
                onClick={handlePermissionRequest}
                disabled={isLoading}
                variant="primary"
                size="sm"
              >
                {isLoading ? 'Requesting...' : 
                  permissionStatus === 'denied' ? 'Re-enable Notifications' : 
                  'Enable Notifications'}
              </Button>
            )}
            {!isSupported && (
              <Button
                onClick={handleDebugTest}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                Debug
              </Button>
            )}
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Types</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.workoutReminders}
                onChange={(e) => handleSettingChange('workoutReminders', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Workout Reminders</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Daily workout schedule reminders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.goalUpdates}
                onChange={(e) => handleSettingChange('goalUpdates', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Goal Updates</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Progress updates on your fitness goals</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.achievements}
                onChange={(e) => handleSettingChange('achievements', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Achievements</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Celebrate your fitness milestones</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.stepGoals}
                onChange={(e) => handleSettingChange('stepGoals', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Step Goals</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Daily step count reminders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.dailyMotivation}
                onChange={(e) => handleSettingChange('dailyMotivation', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Daily Motivation</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Inspirational messages to keep you going</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.mealReminders}
                onChange={(e) => handleSettingChange('mealReminders', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Meal Reminders</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reminders to log your meals</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Checkbox
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                disabled={!notificationService.isNotificationEnabled()}
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 dark:text-white">Weekly Reports</label>
                <p className="text-sm text-gray-600 dark:text-gray-300">Weekly progress summaries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Notifications */}
        {notificationService.isNotificationEnabled() && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧪 Test Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Button
                onClick={handleTestNotification}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Basic Test
              </Button>
              <Button
                onClick={handleWorkoutReminderTest}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Workout
              </Button>
              <Button
                onClick={handleGoalReminderTest}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Goal Update
              </Button>
              <Button
                onClick={handleStepGoalTest}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Step Goal
              </Button>
              <Button
                onClick={handleMotivationTest}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Motivation
              </Button>
              <Button
                onClick={handleMealReminderTest}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Meal
              </Button>
              <Button
                onClick={handleDebugTest}
                variant="outline"
                size="sm"
                className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                Debug Test
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}; 
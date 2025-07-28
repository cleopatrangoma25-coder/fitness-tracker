import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationOptions {
  body: string;
  requireInteraction?: boolean;
  silent?: boolean;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
}

export interface NotificationSettings {
  workoutReminders: boolean;
  goalUpdates: boolean;
  achievements: boolean;
  weeklyReports: boolean;
  dailyMotivation: boolean;
  mealReminders: boolean;
  stepGoals: boolean;
}

export interface NotificationReminder {
  id: string;
  type: 'workout' | 'goal' | 'achievement' | 'motivation' | 'meal' | 'steps';
  title: string;
  body: string;
  scheduledTime?: Date;
  goalId?: string;
  workoutId?: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface GoalBasedReminder {
  goalId: string;
  goalTitle: string;
  currentProgress: number;
  targetProgress: number;
  reminderThreshold: number; // percentage
  message: string;
}

class NotificationService {
  private messaging: any;
  private isSupported: boolean;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator && window.isSecureContext;
    this.permission = this.getCurrentPermissionStatus();
    
    // Debug logging
    console.log('NotificationService initialized:', {
      isSupported: this.isSupported,
      hasNotificationAPI: 'Notification' in window,
      hasServiceWorker: 'serviceWorker' in navigator,
      isSecureContext: window.isSecureContext,
      permission: this.permission
    });
    
    if (this.isSupported) {
      try {
        this.messaging = getMessaging(app);
        this.setupMessageListener();
      } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
        this.isSupported = false;
      }
    }
  }

  /**
   * Check if the app is running in a secure context (required for notifications)
   */
  isSecureContext(): boolean {
    return window.isSecureContext;
  }

  /**
   * Get the current permission status from the browser
   */
  private getCurrentPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return 'denied';
    }
    
    // Check if permission is already granted
    if (Notification.permission) {
      return Notification.permission;
    }
    
    return 'default';
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      console.log('Permission request result:', permission);
      
      if (permission === 'granted') {
        console.log('Permission granted, getting FCM token...');
        await this.getFCMToken();
        return true;
      } else {
        console.warn('Notification permission denied or defaulted');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token for push notifications
   */
  async getFCMToken(): Promise<string | null> {
    if (!this.isSupported || this.permission !== 'granted') {
      return null;
    }

    try {
      const token = await getToken(this.messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        console.log('FCM Token:', token);
        // Store token in localStorage or send to backend
        localStorage.setItem('fcmToken', token);
        return token;
      } else {
        console.warn('No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Setup listener for foreground messages
   */
  private setupMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification even when app is in foreground
      this.showLocalNotification({
        title: payload.notification?.title || 'Fitness Tracker',
        body: payload.notification?.body || 'You have a new notification',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: payload.data
      });
    });
  }

  /**
   * Show a local notification
   */
  showLocalNotification(options: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;
  }) {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    const notificationOptions: NotificationOptions = {
      body: options.body,
      requireInteraction: false,
      silent: false
    };

    if (options.icon) notificationOptions.icon = options.icon;
    if (options.badge) notificationOptions.badge = options.badge;
    if (options.data) notificationOptions.data = options.data;
    if (options.tag) notificationOptions.tag = options.tag;

    const notification = new Notification(options.title, notificationOptions);

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
      
      // Handle different notification types
      if (options.data?.type) {
        this.handleNotificationClick(options.data);
      }
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  /**
   * Handle notification clicks based on type
   */
  private handleNotificationClick(data: any) {
    switch (data.type) {
      case 'workout':
        window.location.href = '/workout';
        break;
      case 'goal':
        window.location.href = '/goals';
        break;
      case 'achievement':
        window.location.href = '/dashboard';
        break;
      case 'steps':
        window.location.href = '/dashboard';
        break;
      default:
        window.location.href = '/dashboard';
    }
  }

  /**
   * Create time-based workout reminders
   */
  createWorkoutReminder(_time: string, _days: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']): NotificationReminder {
    
    return {
      id: `workout-${Date.now()}`,
      type: 'workout',
      title: '💪 Time for your workout!',
      body: 'Your scheduled workout time is now. Let\'s get moving!',
      scheduledTime: new Date(),
      userId: 'current-user', // Will be set by the calling component
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create goal-based reminders
   */
  createGoalReminder(goal: GoalBasedReminder): NotificationReminder {
    
    return {
      id: `goal-${goal.goalId}-${Date.now()}`,
      type: 'goal',
      title: `🎯 Goal Update: ${goal.goalTitle}`,
      body: goal.message,
      goalId: goal.goalId,
      userId: 'current-user',
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create achievement notifications
   */
  createAchievementNotification(achievement: string, description: string): NotificationReminder {
    return {
      id: `achievement-${Date.now()}`,
      type: 'achievement',
      title: `🏆 Achievement Unlocked: ${achievement}`,
      body: description,
      userId: 'current-user',
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create daily motivation reminders
   */
  createMotivationReminder(): NotificationReminder {
    const motivations = [
      'Every step counts towards your goals!',
      'You\'re stronger than you think!',
      'Consistency is the key to success!',
      'Your future self will thank you!',
      'Small progress is still progress!'
    ];
    
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)] || 'Keep pushing towards your goals!';
    
    return {
      id: `motivation-${Date.now()}`,
      type: 'motivation',
      title: '🌟 Daily Motivation',
      body: randomMotivation,
      userId: 'current-user',
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create meal reminder
   */
  createMealReminder(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): NotificationReminder {
    return {
      id: `meal-${mealType}-${Date.now()}`,
      type: 'meal',
      title: '🍽️ Time to log your meal!',
      body: `Don't forget to track your ${mealType} to stay on top of your nutrition goals.`,
      userId: 'current-user',
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create step goal reminder
   */
  createStepGoalReminder(currentSteps: number, targetSteps: number): NotificationReminder {
    const remaining = targetSteps - currentSteps;
    
    if (remaining <= 0) {
      return {
        id: `steps-complete-${Date.now()}`,
        type: 'steps',
        title: '🎉 Step Goal Achieved!',
        body: `Congratulations! You've reached your daily step goal of ${targetSteps} steps!`,
        userId: 'current-user',
        isActive: true,
        createdAt: new Date()
      };
    } else if (remaining <= 1000) {
      return {
        id: `steps-close-${Date.now()}`,
        type: 'steps',
        title: '🚶‍♂️ Almost there!',
        body: `You're only ${remaining} steps away from your daily goal!`,
        userId: 'current-user',
        isActive: true,
        createdAt: new Date()
      };
    } else {
      return {
        id: `steps-reminder-${Date.now()}`,
        type: 'steps',
        title: '👟 Keep moving!',
        body: `You've taken ${currentSteps} steps today. Your goal is ${targetSteps} steps.`,
        userId: 'current-user',
        isActive: true,
        createdAt: new Date()
      };
    }
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(reminder: NotificationReminder, delayMs: number) {
    setTimeout(() => {
      this.showLocalNotification({
        title: reminder.title,
        body: reminder.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: { type: reminder.type, goalId: reminder.goalId, workoutId: reminder.workoutId }
      });
    }, delayMs);
  }

  /**
   * Check if notifications are supported by the browser
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if notifications are both supported and permitted
   */
  isNotificationEnabled(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  /**
   * Check if notifications are supported but permission hasn't been granted
   */
  isNotificationSupportedButNotGranted(): boolean {
    return this.isSupported && this.permission !== 'granted';
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    // Update permission status from browser
    this.permission = this.getCurrentPermissionStatus();
    return this.permission;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    // Store settings in localStorage
    const currentSettings = this.getNotificationSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // Send settings to backend if needed
    console.log('Notification settings updated:', updatedSettings);
  }

  /**
   * Get current notification settings
   */
  getNotificationSettings(): NotificationSettings {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default settings
    return {
      workoutReminders: true,
      goalUpdates: true,
      achievements: true,
      weeklyReports: true,
      dailyMotivation: true,
      mealReminders: false,
      stepGoals: true
    };
  }

  /**
   * Comprehensive test of notification support and functionality
   */
  testNotificationSupport(): {
    isSupported: boolean;
    hasNotificationAPI: boolean;
    hasServiceWorker: boolean;
    isSecureContext: boolean;
    permission: NotificationPermission;
    canSendNotifications: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    const hasNotificationAPI = 'Notification' in window;
    const hasServiceWorker = 'serviceWorker' in navigator;
    const isSecureContext = window.isSecureContext;
    const permission = this.getCurrentPermissionStatus();
    const canSendNotifications = this.isNotificationEnabled();
    
    if (!hasNotificationAPI) {
      issues.push('Notification API not available in this browser');
    }
    
    if (!hasServiceWorker) {
      issues.push('Service Worker not available in this browser');
    }
    
    if (!isSecureContext) {
      issues.push('Not running in a secure context (HTTPS required)');
    }
    
    if (permission === 'denied') {
      issues.push('Notification permission denied by user');
    }
    
    return {
      isSupported: this.isSupported,
      hasNotificationAPI,
      hasServiceWorker,
      isSecureContext,
      permission,
      canSendNotifications,
      issues
    };
  }

  /**
   * Get instructions for enabling notifications when denied
   */
  getEnableInstructions(): string {
    if (this.permission === 'denied') {
      return 'To enable notifications, please:\n1. Click the lock/info icon in your browser\'s address bar\n2. Find "Notifications" in the site settings\n3. Change from "Block" to "Allow"\n4. Refresh the page';
    }
    return '';
  }

  /**
   * Test notification (for development)
   */
  testNotification() {
    this.showLocalNotification({
      title: '🧪 Test Notification',
      body: 'This is a test notification from Fitness Tracker!',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: 'test' }
    });
  }
}

// Create singleton instance
export const notificationService = new NotificationService(); 
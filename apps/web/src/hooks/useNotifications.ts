import { useEffect, useCallback } from 'react';
import { notificationService } from '../lib/notifications';
import { useAuthStore } from '@fitness-tracker/store';
import { useWorkoutStore } from '@fitness-tracker/store';
import { useGoalsStore } from '@fitness-tracker/store';

export const useNotifications = () => {
  const { user } = useAuthStore();
  const { workouts } = useWorkoutStore();
  const { goals } = useGoalsStore();

  // Initialize notifications when user logs in
  useEffect(() => {
    if (user && notificationService.isNotificationSupported()) {
      // Request permission if not already granted
      if (notificationService.getPermissionStatus() !== 'granted') {
        notificationService.requestPermission();
      }
    }
  }, [user]);

  // Send workout completion notification
  const sendWorkoutCompletionNotification = useCallback((workoutName: string) => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.achievements) return;

    const achievement = notificationService.createAchievementNotification(
      'Workout Completed!',
      `Great job completing your ${workoutName} workout! Keep up the momentum!`
    );

    notificationService.showLocalNotification({
      title: achievement.title,
      body: achievement.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: achievement.type }
    });
  }, []);

  // Send goal progress notification
  const sendGoalProgressNotification = useCallback((goalId: string, currentProgress: number, targetProgress: number) => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.goalUpdates) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const progressPercentage = (currentProgress / targetProgress) * 100;
    
    // Send notification at 25%, 50%, 75%, and 100%
    if ([25, 50, 75, 100].includes(Math.floor(progressPercentage))) {
      const goalReminder = {
        goalId: goal.id,
        goalTitle: goal.title,
        currentProgress,
        targetProgress,
        reminderThreshold: progressPercentage,
        message: `You're ${Math.floor(progressPercentage)}% to your goal: ${goal.title}!`
      };

      const reminder = notificationService.createGoalReminder(goalReminder);
      notificationService.showLocalNotification({
        title: reminder.title,
        body: reminder.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: { type: reminder.type, goalId: reminder.goalId }
      });
    }
  }, [goals]);

  // Send step goal notification
  const sendStepGoalNotification = useCallback((currentSteps: number, targetSteps: number) => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.stepGoals) return;

    const reminder = notificationService.createStepGoalReminder(currentSteps, targetSteps);
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  }, []);

  // Send daily motivation
  const sendDailyMotivation = useCallback(() => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.dailyMotivation) return;

    const reminder = notificationService.createMotivationReminder();
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  }, []);

  // Send meal reminder
  const sendMealReminder = useCallback((mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.mealReminders) return;

    const reminder = notificationService.createMealReminder(mealType);
    notificationService.showLocalNotification({
      title: reminder.title,
      body: reminder.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: reminder.type }
    });
  }, []);

  // Schedule workout reminder
  const scheduleWorkoutReminder = useCallback((time: string, days: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']) => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.workoutReminders) return;

    const reminder = notificationService.createWorkoutReminder(time, days);
    
    // Schedule for next occurrence
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours || 0, minutes || 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const delayMs = reminderTime.getTime() - now.getTime();
    notificationService.scheduleNotification(reminder, delayMs);
  }, []);

  // Send weekly report notification
  const sendWeeklyReportNotification = useCallback(() => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.weeklyReports) return;

    const totalWorkouts = workouts.length;
    const completedGoals = goals.filter(g => g.completed).length;
    
    notificationService.showLocalNotification({
      title: '📊 Weekly Fitness Report',
      body: `This week: ${totalWorkouts} workouts completed, ${completedGoals} goals achieved!`,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { type: 'weekly-report' }
    });
  }, [workouts, goals]);

  // Check for achievements
  const checkAchievements = useCallback(() => {
    if (!notificationService.isNotificationSupported()) return;

    const settings = notificationService.getNotificationSettings();
    if (!settings.achievements) return;

    // Check for workout streak
    const recentWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    });

    if (recentWorkouts.length >= 5) {
      const achievement = notificationService.createAchievementNotification(
        'Workout Warrior',
        'You\'ve completed 5 workouts this week! You\'re on fire! 🔥'
      );

      notificationService.showLocalNotification({
        title: achievement.title,
        body: achievement.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: { type: achievement.type }
      });
    }

    // Check for goal completion
    const newlyCompletedGoals = goals.filter(g => g.completed);
    if (newlyCompletedGoals.length > 0) {
      const achievement = notificationService.createAchievementNotification(
        'Goal Crusher',
        `Congratulations! You've achieved ${newlyCompletedGoals.length} goal(s)! 🎉`
      );

      notificationService.showLocalNotification({
        title: achievement.title,
        body: achievement.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        data: { type: achievement.type }
      });
    }
  }, [workouts, goals]);

  return {
    sendWorkoutCompletionNotification,
    sendGoalProgressNotification,
    sendStepGoalNotification,
    sendDailyMotivation,
    sendMealReminder,
    scheduleWorkoutReminder,
    sendWeeklyReportNotification,
    checkAchievements,
    isSupported: notificationService.isNotificationSupported(),
    permissionStatus: notificationService.getPermissionStatus()
  };
}; 
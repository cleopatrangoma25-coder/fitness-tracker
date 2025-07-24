import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Workout, Exercise } from '@fitness-tracker/shared';

export class WorkoutService {
  // Create a new workout
  static async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    try {
      const data = {
        ...workoutData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'workouts'), data);
      
      return {
        id: docRef.id,
        ...data,
      } as Workout;
    } catch (error) {
      console.error('Create workout error:', error);
      throw new Error('Failed to create workout');
    }
  }

  // Get a workout by ID
  static async getWorkout(workoutId: string): Promise<Workout | null> {
    try {
      const docRef = doc(db, 'workouts', workoutId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      } as Workout;
    } catch (error) {
      console.error('Get workout error:', error);
      throw new Error('Failed to get workout');
    }
  }

  // Get user's workouts
  static async getUserWorkouts(userId: string, limitCount: number = 20): Promise<Workout[]> {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const workouts: Workout[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Workout);
      });

      return workouts;
    } catch (error) {
      console.error('Get user workouts error:', error);
      throw new Error('Failed to get user workouts');
    }
  }

  // Update a workout
  static async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout> {
    try {
      const docRef = doc(db, 'workouts', workoutId);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(docRef, updateData);
      
      // Get the updated workout
      const updatedWorkout = await this.getWorkout(workoutId);
      if (!updatedWorkout) {
        throw new Error('Workout not found');
      }

      return updatedWorkout;
    } catch (error) {
      console.error('Update workout error:', error);
      throw new Error('Failed to update workout');
    }
  }

  // Delete a workout
  static async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const docRef = doc(db, 'workouts', workoutId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete workout error:', error);
      throw new Error('Failed to delete workout');
    }
  }

  // Get all exercises
  static async getExercises(): Promise<Exercise[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'exercises'));
      const exercises: Exercise[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        exercises.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Exercise);
      });

      return exercises;
    } catch (error) {
      console.error('Get exercises error:', error);
      throw new Error('Failed to get exercises');
    }
  }

  // Analytics: Get workout statistics
  static async getWorkoutStats(userId: string): Promise<{
    totalWorkouts: number;
    thisWeek: number;
    thisMonth: number;
    lastWorkout: Date | null;
    averageWorkoutsPerWeek: number;
    longestStreak: number;
    currentStreak: number;
  }> {
    try {
      const workouts = await this.getUserWorkouts(userId, 1000); // Get all workouts for analysis
      
      if (workouts.length === 0) {
        return {
          totalWorkouts: 0,
          thisWeek: 0,
          thisMonth: 0,
          lastWorkout: null,
          averageWorkoutsPerWeek: 0,
          longestStreak: 0,
          currentStreak: 0,
        };
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = workouts.filter(w => w.date >= oneWeekAgo).length;
      const thisMonth = workouts.filter(w => w.date >= oneMonthAgo).length;
      const lastWorkout = workouts[0]?.date || null;

      // Calculate streaks
      const sortedWorkouts = workouts.sort((a, b) => b.date.getTime() - a.date.getTime());
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);

        if (lastDate === null) {
          tempStreak = 1;
          lastDate = workoutDate;
        } else {
          const diffDays = Math.floor((lastDate.getTime() - workoutDate.getTime()) / (24 * 60 * 60 * 1000));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
          lastDate = workoutDate;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);

      // Calculate current streak (consecutive days from today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = today;
      currentStreak = 0;

      for (let i = 0; i < 365; i++) { // Check up to a year back
        const hasWorkout = sortedWorkouts.some(w => {
          const workoutDate = new Date(w.date);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === checkDate.getTime();
        });

        if (hasWorkout) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      }

      // Calculate average workouts per week
      const firstWorkout = workouts[workouts.length - 1]?.date;
      const weeksSinceFirst = firstWorkout ? Math.max(1, Math.ceil((now.getTime() - firstWorkout.getTime()) / (7 * 24 * 60 * 60 * 1000))) : 1;
      const averageWorkoutsPerWeek = workouts.length / weeksSinceFirst;

      return {
        totalWorkouts: workouts.length,
        thisWeek,
        thisMonth,
        lastWorkout,
        averageWorkoutsPerWeek: Math.round(averageWorkoutsPerWeek * 10) / 10,
        longestStreak,
        currentStreak,
      };
    } catch (error) {
      console.error('Get workout stats error:', error);
      throw new Error('Failed to get workout statistics');
    }
  }

  // Analytics: Get muscle group distribution
  static async getMuscleGroupStats(userId: string): Promise<{
    muscleGroup: string;
    count: number;
    percentage: number;
  }[]> {
    try {
      const workouts = await this.getUserWorkouts(userId, 1000);
      const muscleGroupCounts: { [key: string]: number } = {};

      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          // Get muscle group from exercise name or use a default
          const muscleGroup = this.getMuscleGroupFromExercise(exercise.name);
          muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
        });
      });

      const total = Object.values(muscleGroupCounts).reduce((sum, count) => sum + count, 0);
      
      return Object.entries(muscleGroupCounts)
        .map(([muscleGroup, count]) => ({
          muscleGroup,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Get muscle group stats error:', error);
      throw new Error('Failed to get muscle group statistics');
    }
  }

  // Analytics: Get personal records for exercises
  static async getPersonalRecords(userId: string): Promise<{
    exerciseName: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    lastAchieved: Date;
  }[]> {
    try {
      const workouts = await this.getUserWorkouts(userId, 1000);
      const exerciseRecords: { [key: string]: {
        maxWeight: number;
        maxReps: number;
        maxVolume: number;
        lastAchieved: Date;
      } } = {};

      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            if (set.completed && set.weight && set.reps) {
              const volume = set.weight * set.reps;
              const currentRecord = exerciseRecords[exercise.name] || {
                maxWeight: 0,
                maxReps: 0,
                maxVolume: 0,
                lastAchieved: new Date(0)
              };

              // Update max weight
              if (set.weight > currentRecord.maxWeight) {
                currentRecord.maxWeight = set.weight;
                currentRecord.lastAchieved = new Date(workout.date);
              }

              // Update max reps
              if (set.reps > currentRecord.maxReps) {
                currentRecord.maxReps = set.reps;
                currentRecord.lastAchieved = new Date(workout.date);
              }

              // Update max volume
              if (volume > currentRecord.maxVolume) {
                currentRecord.maxVolume = volume;
                currentRecord.lastAchieved = new Date(workout.date);
              }

              exerciseRecords[exercise.name] = currentRecord;
            }
          });
        });
      });

      return Object.entries(exerciseRecords)
        .map(([exerciseName, record]) => ({
          exerciseName,
          ...record
        }))
        .sort((a, b) => b.maxVolume - a.maxVolume);
    } catch (error) {
      console.error('Get personal records error:', error);
      throw new Error('Failed to get personal records');
    }
  }

  // Analytics: Get progressive overload data for specific exercises
  static async getProgressiveOverloadData(userId: string, exerciseName: string, weeks: number = 12): Promise<{
    date: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
  }[]> {
    try {
      const workouts = await this.getUserWorkouts(userId, 1000);
      const exerciseData: { [key: string]: {
        maxWeight: number;
        maxReps: number;
        maxVolume: number;
      } } = {};

      // Filter workouts to the specified time period
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));

      workouts
        .filter(workout => new Date(workout.date) >= cutoffDate)
        .forEach(workout => {
          const exercise = workout.exercises.find(e => 
            e.name.toLowerCase().includes(exerciseName.toLowerCase()) ||
            exerciseName.toLowerCase().includes(e.name.toLowerCase())
          );

          if (exercise) {
            const dateKey = new Date(workout.date).toISOString().split('T')[0];
            if (dateKey) {
              const currentData = exerciseData[dateKey] || {
                maxWeight: 0,
                maxReps: 0,
                maxVolume: 0
              };

            exercise.sets.forEach(set => {
              if (set.completed && set.weight && set.reps) {
                const volume = set.weight * set.reps;
                
                currentData.maxWeight = Math.max(currentData.maxWeight, set.weight);
                currentData.maxReps = Math.max(currentData.maxReps, set.reps);
                currentData.maxVolume = Math.max(currentData.maxVolume, volume);
              }
            });

            exerciseData[dateKey] = currentData;
            }
          }
        });

      return Object.entries(exerciseData)
        .map(([date, data]) => ({
          date,
          ...data
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Get progressive overload data error:', error);
      throw new Error('Failed to get progressive overload data');
    }
  }

  // Analytics: Get weekly workout data for charts
  static async getWeeklyWorkoutData(userId: string, weeks: number = 8): Promise<{
    week: string;
    workouts: number;
    exercises: number;
    totalVolume: number;
  }[]> {
    try {
      const workouts = await this.getUserWorkouts(userId, 1000);
      const weeklyData: { [key: string]: { workouts: number; exercises: number; totalVolume: number } } = {};

      const now = new Date();
      
      // Initialize last 8 weeks
      for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0];
        if (weekKey) {
          weeklyData[weekKey] = { workouts: 0, exercises: 0, totalVolume: 0 };
        }
      }

      // Process workouts
      workouts.forEach(workout => {
        const workoutDate = new Date(workout.date);
        const weekStart = new Date(workoutDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (weekKey && weeklyData[weekKey]) {
          const weekData = weeklyData[weekKey];
          weekData.workouts++;
          weekData.exercises += workout.exercises.length;
          
          // Calculate total volume (reps * weight, or just reps if no weight)
          let volume = 0;
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              if (set.completed) {
                volume += set.reps * (set.weight || 1);
              }
            });
          });
          weekData.totalVolume += volume;
        }
      });

      return Object.entries(weeklyData)
        .map(([week, data]) => ({
          week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          ...data,
        }))
        .reverse(); // Most recent first
    } catch (error) {
      console.error('Get weekly workout data error:', error);
      throw new Error('Failed to get weekly workout data');
    }
  }

  // Helper: Get muscle group from exercise name
  private static getMuscleGroupFromExercise(exerciseName: string): string {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('push') || name.includes('bench') || name.includes('chest')) return 'Chest';
    if (name.includes('pull') || name.includes('row') || name.includes('back')) return 'Back';
    if (name.includes('shoulder') || name.includes('press')) return 'Shoulders';
    if (name.includes('curl') || name.includes('bicep')) return 'Biceps';
    if (name.includes('tricep') || name.includes('dip')) return 'Triceps';
    if (name.includes('squat') || name.includes('leg') || name.includes('lunge')) return 'Legs';
    if (name.includes('plank') || name.includes('crunch') || name.includes('core')) return 'Core';
    if (name.includes('run') || name.includes('cardio') || name.includes('cycle')) return 'Cardio';
    
    return 'Other';
  }
} 
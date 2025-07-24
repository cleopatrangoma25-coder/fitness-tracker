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
import type { Goal } from '@fitness-tracker/shared';

export class GoalsService {
  // Create a new goal
  static async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    try {
      const data = {
        ...goalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'goals'), data);
      
      return {
        id: docRef.id,
        ...data,
      } as Goal;
    } catch (error) {
      console.error('Create goal error:', error);
      throw new Error('Failed to create goal');
    }
  }

  // Get all goals for a user
  static async getGoals(userId: string): Promise<Goal[]> {
    try {
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId)
        // Removed orderBy to avoid requiring composite index
      );
      
      const querySnapshot = await getDocs(q);
      const goals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
      
      // Sort client-side instead
      return goals.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
    } catch (error) {
      console.error('Get goals error:', error);
      throw new Error('Failed to fetch goals');
    }
  }

  // Get a specific goal by ID
  static async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      const docRef = doc(db, 'goals', goalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Goal;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get goal error:', error);
      throw new Error('Failed to fetch goal');
    }
  }

  // Update a goal
  static async updateGoal(goalId: string, goalData: Partial<Goal>): Promise<Goal> {
    try {
      const docRef = doc(db, 'goals', goalId);
      const updateData = {
        ...goalData,
        updatedAt: new Date(),
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as Goal;
    } catch (error) {
      console.error('Update goal error:', error);
      throw new Error('Failed to update goal');
    }
  }

  // Update goal progress
  static async updateGoalProgress(goalId: string, currentValue: number): Promise<Goal> {
    try {
      const docRef = doc(db, 'goals', goalId);
      const updateData = {
        currentValue,
        updatedAt: new Date(),
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as Goal;
    } catch (error) {
      console.error('Update goal progress error:', error);
      throw new Error('Failed to update goal progress');
    }
  }

  // Delete a goal
  static async deleteGoal(goalId: string): Promise<void> {
    try {
      const docRef = doc(db, 'goals', goalId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete goal error:', error);
      throw new Error('Failed to delete goal');
    }
  }

  // Get active goals for a user
  static async getActiveGoals(userId: string): Promise<Goal[]> {
    try {
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId),
        where('status', '==', 'ACTIVE'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
    } catch (error) {
      console.error('Get active goals error:', error);
      throw new Error('Failed to fetch active goals');
    }
  }
} 
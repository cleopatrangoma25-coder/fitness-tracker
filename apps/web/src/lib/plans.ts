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
  writeBatch,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { FitnessPlan } from '@fitness-tracker/shared';

export class PlansService {
  // Create a new fitness plan
  static async createPlan(planData: Omit<FitnessPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<FitnessPlan> {
    try {
      const data = {
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'plans'), data);
      
      return {
        id: docRef.id,
        ...data,
      } as FitnessPlan;
    } catch (error) {
      console.error('Create plan error:', error);
      throw new Error('Failed to create plan');
    }
  }

  // Get all plans for a user
  static async getPlans(userId: string): Promise<FitnessPlan[]> {
    try {
      const q = query(
        collection(db, 'plans'),
        where('userId', '==', userId)
        // Removed orderBy to avoid requiring composite index
      );
      
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FitnessPlan[];
      
      // Sort client-side instead
      return plans.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
    } catch (error) {
      console.error('Get plans error:', error);
      throw new Error('Failed to fetch plans');
    }
  }

  // Get a specific plan by ID
  static async getPlanById(planId: string): Promise<FitnessPlan | null> {
    try {
      const docRef = doc(db, 'plans', planId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as FitnessPlan;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get plan error:', error);
      throw new Error('Failed to fetch plan');
    }
  }

  // Update a plan
  static async updatePlan(planId: string, planData: Partial<FitnessPlan>): Promise<FitnessPlan> {
    try {
      const docRef = doc(db, 'plans', planId);
      const updateData = {
        ...planData,
        updatedAt: new Date(),
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as FitnessPlan;
    } catch (error) {
      console.error('Update plan error:', error);
      throw new Error('Failed to update plan');
    }
  }

  // Delete a plan
  static async deletePlan(planId: string): Promise<void> {
    try {
      const docRef = doc(db, 'plans', planId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete plan error:', error);
      throw new Error('Failed to delete plan');
    }
  }

  // Activate a plan (deactivates all others)
  static async activatePlan(planId: string, userId: string): Promise<FitnessPlan> {
    try {
      const batch = writeBatch(db);
      
      // Deactivate all other plans for this user
      const q = query(
        collection(db, 'plans'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 
          isActive: false, 
          updatedAt: new Date() 
        });
      });
      
      // Activate the selected plan
      const planRef = doc(db, 'plans', planId);
      batch.update(planRef, { 
        isActive: true, 
        updatedAt: new Date() 
      });
      
      await batch.commit();
      
      // Return the updated plan
      const updatedDoc = await getDoc(planRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as FitnessPlan;
    } catch (error) {
      console.error('Activate plan error:', error);
      throw new Error('Failed to activate plan');
    }
  }

  // Get active plan for a user
  static async getActivePlan(userId: string): Promise<FitnessPlan | null> {
    try {
      const q = query(
        collection(db, 'plans'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      if (!doc) return null;
      return {
        id: doc.id,
        ...doc.data(),
      } as FitnessPlan;
    } catch (error) {
      console.error('Get active plan error:', error);
      throw new Error('Failed to fetch active plan');
    }
  }
} 
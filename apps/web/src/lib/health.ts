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
import type { 
  HealthLog, 
  HealthInsight, 
  HealthCorrelation,
  MenstrualData,
  PainData,
  IllnessData,
  BloodPressureData,
  BloodGlucoseData
} from '@fitness-tracker/shared';

export class HealthService {
  // Create a new health log
  static async createHealthLog(logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthLog> {
    try {
      const data = {
        ...logData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'healthLogs'), data);
      
      return {
        id: docRef.id,
        ...data,
      } as HealthLog;
    } catch (error) {
      console.error('Create health log error:', error);
      throw new Error('Failed to create health log');
    }
  }

  // Get a health log by ID
  static async getHealthLog(logId: string): Promise<HealthLog | null> {
    try {
      const docRef = doc(db, 'healthLogs', logId);
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
      } as HealthLog;
    } catch (error) {
      console.error('Get health log error:', error);
      throw new Error('Failed to get health log');
    }
  }

  // Get user's health logs
  static async getUserHealthLogs(userId: string, limitCount: number = 50): Promise<HealthLog[]> {
    try {
      const q = query(
        collection(db, 'healthLogs'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const logs: HealthLog[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as HealthLog);
      });

      return logs;
    } catch (error) {
      console.error('Get user health logs error:', error);
      throw new Error('Failed to get user health logs');
    }
  }

  // Get health logs by type
  static async getHealthLogsByType(userId: string, type: HealthLog['type'], limitCount: number = 20): Promise<HealthLog[]> {
    try {
      const q = query(
        collection(db, 'healthLogs'),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const logs: HealthLog[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as HealthLog);
      });

      return logs;
    } catch (error) {
      console.error('Get health logs by type error:', error);
      throw new Error('Failed to get health logs by type');
    }
  }

  // Update a health log
  static async updateHealthLog(logId: string, updates: Partial<HealthLog>): Promise<HealthLog> {
    try {
      const docRef = doc(db, 'healthLogs', logId);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(docRef, updateData);
      
      // Get the updated document
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        date: data?.date instanceof Timestamp ? data.date.toDate() : data?.date,
        createdAt: data?.createdAt instanceof Timestamp ? data.createdAt.toDate() : data?.createdAt,
        updatedAt: data?.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data?.updatedAt,
      } as HealthLog;
    } catch (error) {
      console.error('Update health log error:', error);
      throw new Error('Failed to update health log');
    }
  }

  // Delete a health log
  static async deleteHealthLog(logId: string): Promise<void> {
    try {
      const docRef = doc(db, 'healthLogs', logId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete health log error:', error);
      throw new Error('Failed to delete health log');
    }
  }

  // Add menstrual log
  static async addMenstrualLog(userId: string, data: MenstrualData, date: string, notes?: string): Promise<HealthLog> {
    const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      type: 'menstrual',
      data,
      ...(notes && { notes }),
    };
    return this.createHealthLog(logData);
  }

  // Add pain log
  static async addPainLog(userId: string, data: PainData, date: string, notes?: string): Promise<HealthLog> {
    const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      type: 'pain',
      data,
      ...(notes && { notes }),
    };
    return this.createHealthLog(logData);
  }

  // Add illness log
  static async addIllnessLog(userId: string, data: IllnessData, date: string, notes?: string): Promise<HealthLog> {
    const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      type: 'illness',
      data,
      ...(notes && { notes }),
    };
    return this.createHealthLog(logData);
  }

  // Add blood pressure log
  static async addBloodPressureLog(userId: string, data: BloodPressureData, date: string, notes?: string): Promise<HealthLog> {
    const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      type: 'bloodPressure',
      data,
      ...(notes && { notes }),
    };
    return this.createHealthLog(logData);
  }

  // Add blood glucose log
  static async addBloodGlucoseLog(userId: string, data: BloodGlucoseData, date: string, notes?: string): Promise<HealthLog> {
    const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      type: 'bloodGlucose',
      data,
      ...(notes && { notes }),
    };
    return this.createHealthLog(logData);
  }

  // Get health statistics
  static async getHealthStats(userId: string): Promise<{
    totalLogs: number;
    logsByType: Record<string, number>;
    recentActivity: HealthLog[];
    lastLogDate: Date | null;
  }> {
    try {
      const logs = await this.getUserHealthLogs(userId, 100);
      
      const logsByType: Record<string, number> = {};
      logs.forEach(log => {
        logsByType[log.type] = (logsByType[log.type] || 0) + 1;
      });

      const recentActivity = logs.slice(0, 10);
      const lastLogDate = logs.length > 0 ? logs[0].createdAt : null;

      return {
        totalLogs: logs.length,
        logsByType,
        recentActivity,
        lastLogDate,
      };
    } catch (error) {
      console.error('Get health stats error:', error);
      throw new Error('Failed to get health statistics');
    }
  }

  // Create health insight
  static async createHealthInsight(insightData: Omit<HealthInsight, 'id' | 'createdAt'>): Promise<HealthInsight> {
    try {
      const data = {
        ...insightData,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'healthInsights'), data);
      
      return {
        id: docRef.id,
        ...data,
      } as HealthInsight;
    } catch (error) {
      console.error('Create health insight error:', error);
      throw new Error('Failed to create health insight');
    }
  }

  // Get user's health insights
  static async getUserHealthInsights(userId: string, limitCount: number = 20): Promise<HealthInsight[]> {
    try {
      const q = query(
        collection(db, 'healthInsights'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const insights: HealthInsight[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        insights.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        } as HealthInsight);
      });

      return insights;
    } catch (error) {
      console.error('Get user health insights error:', error);
      throw new Error('Failed to get user health insights');
    }
  }

  // Update health insight (e.g., mark as dismissed)
  static async updateHealthInsight(insightId: string, updates: Partial<HealthInsight>): Promise<HealthInsight> {
    try {
      const docRef = doc(db, 'healthInsights', insightId);
      await updateDoc(docRef, updates);
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt instanceof Timestamp ? data.createdAt.toDate() : data?.createdAt,
      } as HealthInsight;
    } catch (error) {
      console.error('Update health insight error:', error);
      throw new Error('Failed to update health insight');
    }
  }
} 
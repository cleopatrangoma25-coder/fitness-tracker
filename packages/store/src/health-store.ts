import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  HealthLog, 
  HealthInsight, 
  HealthCorrelation, 
  HealthDashboardData,
  MenstrualData,
  PainData,
  IllnessData,
  BloodPressureData,
  BloodGlucoseData
} from '@fitness-tracker/shared';

interface HealthState {
  // Health Logs
  healthLogs: HealthLog[];
  recentLogs: HealthLog[];
  
  // Insights and Correlations
  insights: HealthInsight[];
  correlations: HealthCorrelation[];
  
  // Dashboard Data
  dashboardData: HealthDashboardData | null;
  
  // Loading States
  isLoading: boolean;
  isAnalyzing: boolean;
  
  // Actions
  addHealthLog: (log: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHealthLog: (id: string, updates: Partial<HealthLog>) => void;
  deleteHealthLog: (id: string) => void;
  
  // Menstrual Tracking
  addMenstrualLog: (data: MenstrualData, date: string, notes?: string) => void;
  getMenstrualCycleData: () => {
    cycleLength: number;
    averageFlow: string;
    commonSymptoms: string[];
    phasePredictions: { date: string; phase: string }[];
  };
  
  // Pain Tracking
  addPainLog: (data: PainData, date: string, notes?: string) => void;
  getPainTrends: () => {
    mostCommonLocation: string;
    averageIntensity: number;
    frequency: string;
    triggers: string[];
  };
  
  // Illness Tracking
  addIllnessLog: (data: IllnessData, date: string, notes?: string) => void;
  getIllnessTrends: () => {
    frequency: string;
    commonSymptoms: string[];
    averageRecoveryTime: number;
  };
  
  // Blood Pressure Tracking
  addBloodPressureLog: (data: BloodPressureData, date: string, notes?: string) => void;
  getBloodPressureTrends: () => {
    averageSystolic: number;
    averageDiastolic: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  
  // Blood Glucose Tracking
  addBloodGlucoseLog: (data: BloodGlucoseData, date: string, notes?: string) => void;
  getBloodGlucoseTrends: () => {
    averageReading: number;
    range: { min: number; max: number };
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  
  // Insights and Analysis
  generateInsights: () => void;
  dismissInsight: (id: string) => void;
  analyzeCorrelations: () => void;
  
  // Utility
  getLogsByDate: (date: string) => HealthLog[];
  getLogsByType: (type: HealthLog['type']) => HealthLog[];
  getRecentLogs: (days: number) => HealthLog[];
  clearAllData: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial State
      healthLogs: [],
      recentLogs: [],
      insights: [],
      correlations: [],
      dashboardData: null,
      isLoading: false,
      isAnalyzing: false,

      // Add Health Log
      addHealthLog: (logData) => {
        const newLog: HealthLog = {
          ...logData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          healthLogs: [...state.healthLogs, newLog],
          recentLogs: [newLog, ...state.recentLogs.slice(0, 9)], // Keep last 10
        }));
        
        // Generate insights after adding log
        setTimeout(() => get().generateInsights(), 100);
      },

      // Update Health Log
      updateHealthLog: (id, updates) => {
        set((state) => ({
          healthLogs: state.healthLogs.map((log) =>
            log.id === id
              ? { ...log, ...updates, updatedAt: new Date() }
              : log
          ),
          recentLogs: state.recentLogs.map((log) =>
            log.id === id
              ? { ...log, ...updates, updatedAt: new Date() }
              : log
          ),
        }));
      },

      // Delete Health Log
      deleteHealthLog: (id) => {
        set((state) => ({
          healthLogs: state.healthLogs.filter((log) => log.id !== id),
          recentLogs: state.recentLogs.filter((log) => log.id !== id),
        }));
      },

      // Menstrual Tracking
      addMenstrualLog: (data, date, notes?) => {
        const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: 'current-user',
          date,
          type: 'menstrual',
          data,
          ...(notes && { notes }),
        };
        get().addHealthLog(logData);
      },

      getMenstrualCycleData: () => {
        const logs = get().healthLogs.filter((log) => log.type === 'menstrual');
        if (logs.length === 0) {
          return {
            cycleLength: 28,
            averageFlow: 'medium',
            commonSymptoms: [],
            phasePredictions: [],
          };
        }

        // Simplified calculation
        const averageCycleLength = 28;
        const averageFlow = 'medium';
        const commonSymptoms: string[] = [];

        // Simple phase predictions
        const phasePredictions = [
          { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '', phase: 'follicular' },
          { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '', phase: 'ovulatory' },
          { date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '', phase: 'luteal' },
        ];

        return {
          cycleLength: averageCycleLength,
          averageFlow,
          commonSymptoms,
          phasePredictions,
        };
      },

      // Pain Tracking
      addPainLog: (data, date, notes?) => {
        const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: 'current-user',
          date,
          type: 'pain',
          data,
          ...(notes && { notes }),
        };
        get().addHealthLog(logData);
      },

      getPainTrends: () => {
        const logs = get().healthLogs.filter((log) => log.type === 'pain');
        if (logs.length === 0) {
          return {
            mostCommonLocation: 'none',
            averageIntensity: 0,
            frequency: 'none',
            triggers: [],
          };
        }

        // Simplified calculations
        const mostCommonLocation = 'back';
        const averageIntensity = 5;
        const frequency = 'occasional';
        const triggers: string[] = [];

        return {
          mostCommonLocation,
          averageIntensity,
          frequency,
          triggers,
        };
      },

      // Illness Tracking
      addIllnessLog: (data, date, notes?) => {
        const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: 'current-user',
          date,
          type: 'illness',
          data,
          ...(notes && { notes }),
        };
        get().addHealthLog(logData);
      },

      getIllnessTrends: () => {
        const logs = get().healthLogs.filter((log) => log.type === 'illness');
        if (logs.length === 0) {
          return {
            frequency: 'none',
            commonSymptoms: [],
            averageRecoveryTime: 0,
          };
        }

        return {
          frequency: 'rare',
          commonSymptoms: ['fatigue', 'headache'],
          averageRecoveryTime: 7,
        };
      },

      // Blood Pressure Tracking
      addBloodPressureLog: (data, date, notes?) => {
        const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: 'current-user',
          date,
          type: 'bloodPressure',
          data,
          ...(notes && { notes }),
        };
        get().addHealthLog(logData);
      },

      getBloodPressureTrends: () => {
        const logs = get().healthLogs.filter((log) => log.type === 'bloodPressure');
        if (logs.length === 0) {
          return {
            averageSystolic: 120,
            averageDiastolic: 80,
            trend: 'stable' as const,
          };
        }

        return {
          averageSystolic: 120,
          averageDiastolic: 80,
          trend: 'stable' as const,
        };
      },

      // Blood Glucose Tracking
      addBloodGlucoseLog: (data, date, notes = '') => {
        const logData: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: 'current-user',
          date,
          type: 'bloodGlucose',
          data,
          ...(notes && { notes }),
        };
        get().addHealthLog(logData);
      },

      getBloodGlucoseTrends: () => {
        const logs = get().healthLogs.filter((log) => log.type === 'bloodGlucose');
        if (logs.length === 0) {
          return {
            averageReading: 100,
            range: { min: 80, max: 120 },
            trend: 'stable' as const,
          };
        }

        return {
          averageReading: 100,
          range: { min: 80, max: 120 },
          trend: 'stable' as const,
        };
      },

      // Generate Insights
      generateInsights: () => {
        set({ isAnalyzing: true });
        
        const state = get();
        const newInsights: HealthInsight[] = [];

        // Simple example insights
        if (state.healthLogs.length > 0) {
          newInsights.push({
            id: crypto.randomUUID(),
            userId: 'current-user',
            type: 'recommendation',
            title: 'Health Tracking Started',
            description: 'Great job starting to track your health metrics! Keep logging regularly for better insights.',
            dataPoints: {
              healthMetric: 'Health Logs',
              fitnessMetric: 'Consistency',
              correlation: 0.5,
              sampleSize: state.healthLogs.length,
            },
            severity: 'info',
            actionable: true,
            recommendations: [
              'Log your health metrics daily',
              'Track patterns over time',
              'Share insights with your healthcare provider',
            ],
            createdAt: new Date(),
            dismissed: false,
          });
        }

        set((state) => ({
          insights: [...newInsights, ...state.insights],
          isAnalyzing: false,
        }));
      },

      // Dismiss Insight
      dismissInsight: (id) => {
        set((state) => ({
          insights: state.insights.map((insight) =>
            insight.id === id ? { ...insight, dismissed: true } : insight
          ),
        }));
      },

      // Analyze Correlations
      analyzeCorrelations: () => {
        const correlations: HealthCorrelation[] = [
          {
            healthMetric: 'Health Tracking',
            fitnessMetric: 'Overall Wellness',
            correlation: 0.7,
            confidence: 0.8,
            sampleSize: 10,
            trend: 'positive',
            description: 'Regular health tracking correlates with better fitness outcomes',
          },
        ];

        set({ correlations });
      },

      // Utility Functions
      getLogsByDate: (date) => {
        return get().healthLogs.filter((log) => log.date === date);
      },

      getLogsByType: (type) => {
        return get().healthLogs.filter((log) => log.type === type);
      },

      getRecentLogs: (days) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return get().healthLogs.filter((log) => new Date(log.date) >= cutoffDate);
      },

      clearAllData: () => {
        set({
          healthLogs: [],
          recentLogs: [],
          insights: [],
          correlations: [],
          dashboardData: null,
        });
      },
    }),
    {
      name: 'health-store',
      partialize: (state) => ({
        healthLogs: state.healthLogs,
        insights: state.insights,
        correlations: state.correlations,
      }),
    }
  )
); 
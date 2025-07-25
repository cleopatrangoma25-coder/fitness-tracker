import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@fitness-tracker/ui';
import { useHealthStore, useAuthStore } from '@fitness-tracker/store';
import { HealthService } from '../../lib/health';
import type { HealthLog, HealthInsight } from '@fitness-tracker/shared';
import { MenstrualTracker } from './MenstrualTracker';
import { PainTracker } from './PainTracker';
import { IllnessTracker } from './IllnessTracker';
import { BloodPressureTracker } from './BloodPressureTracker';
import { BloodGlucoseTracker } from './BloodGlucoseTracker';
import { HealthInsights } from './HealthInsights';
import { HealthCorrelations } from './HealthCorrelations';

export const HealthDashboard: React.FC = () => {
  const {
    healthLogs,
    insights,
    correlations,
    getRecentLogs,
    analyzeCorrelations,
    addHealthLog,
  } = useHealthStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'tracking' | 'insights' | 'correlations'>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load health data from Firebase when component mounts
  useEffect(() => {
    const loadHealthData = async () => {
      if (!user?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load health logs from Firebase
        const firebaseLogs = await HealthService.getUserHealthLogs(user.userId, 100);
        
        // Add logs to local store if they don't already exist
        firebaseLogs.forEach(log => {
          const existingLog = healthLogs.find(h => h.id === log.id);
          if (!existingLog) {
            addHealthLog(log);
          }
        });

        // Load health insights from Firebase
        const firebaseInsights = await HealthService.getUserHealthInsights(user.userId, 20);
        
        // Note: You might want to add a method to the health store to sync insights
        // For now, we'll just load the logs
        
      } catch (error) {
        console.error('Failed to load health data from Firebase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthData();
  }, [user?.userId, addHealthLog]);

  useEffect(() => {
    analyzeCorrelations();
  }, [analyzeCorrelations]);

  const recentLogs = getRecentLogs(7);
  const todaysLogs = healthLogs.filter(log => log.date === selectedDate);

  const getHealthSummary = () => {
    const totalLogs = healthLogs.length;
    const recentLogsCount = recentLogs.length;
    const activeInsights = insights.filter(insight => !insight.dismissed).length;
    
    return {
      totalLogs,
      recentLogsCount,
      activeInsights,
      hasRecentActivity: recentLogsCount > 0,
    };
  };

  const summary = getHealthSummary();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-surface-50 to-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your health data...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.totalLogs}</div>
            <div className="text-sm text-gray-600">Total Health Logs</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.recentLogsCount}</div>
            <div className="text-sm text-gray-600">Logs This Week</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.activeInsights}</div>
            <div className="text-sm text-gray-600">Active Insights</div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Health Activity</h3>
        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getHealthTypeColor(log.type)}`}></div>
                  <div>
                    <div className="font-medium">{getHealthTypeLabel(log.type)}</div>
                    <div className="text-sm text-gray-600">{log.date}</div>
                  </div>
                </div>
                <Badge variant="outline">{log.type}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No recent health activity</p>
            <p className="text-sm">Start tracking your health metrics to see insights here</p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveTab('tracking')}
            className="flex flex-col items-center p-4 h-auto"
          >
            <span className="text-2xl mb-2">🩸</span>
            <span className="text-sm">Log Pain</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('tracking')}
            className="flex flex-col items-center p-4 h-auto"
          >
            <span className="text-2xl mb-2">🌡️</span>
            <span className="text-sm">Log Illness</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('tracking')}
            className="flex flex-col items-center p-4 h-auto"
          >
            <span className="text-2xl mb-2">💓</span>
            <span className="text-sm">Blood Pressure</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('tracking')}
            className="flex flex-col items-center p-4 h-auto"
          >
            <span className="text-2xl mb-2">🩸</span>
            <span className="text-sm">Blood Glucose</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === 'tracking' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tracking')}
        >
          Health Tracking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MenstrualTracker />
        <PainTracker />
        <IllnessTracker />
        <BloodPressureTracker />
        <BloodGlucoseTracker />
      </div>
    </div>
  );

  const getHealthTypeColor = (type: HealthLog['type']) => {
    switch (type) {
      case 'menstrual': return 'bg-pink-500';
      case 'pain': return 'bg-red-500';
      case 'illness': return 'bg-yellow-500';
      case 'bloodPressure': return 'bg-blue-500';
      case 'bloodGlucose': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthTypeLabel = (type: HealthLog['type']) => {
    switch (type) {
      case 'menstrual': return 'Menstrual Cycle';
      case 'pain': return 'Pain & Soreness';
      case 'illness': return 'Illness Symptoms';
      case 'bloodPressure': return 'Blood Pressure';
      case 'bloodGlucose': return 'Blood Glucose';
      default: return 'Health Log';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health & Medical Dashboard</h1>
        <p className="text-gray-600">
          Track your health metrics and discover insights about how they relate to your fitness journey.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'tracking' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tracking')}
        >
          Health Tracking
        </Button>
        <Button
          variant={activeTab === 'insights' ? 'default' : 'outline'}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </Button>
        <Button
          variant={activeTab === 'correlations' ? 'default' : 'outline'}
          onClick={() => setActiveTab('correlations')}
        >
          Correlations
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'tracking' && renderTracking()}
      {activeTab === 'insights' && <HealthInsights />}
      {activeTab === 'correlations' && <HealthCorrelations />}
    </div>
  );
}; 
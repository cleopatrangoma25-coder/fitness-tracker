import React from 'react';
import { Card, Badge } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { HealthCorrelation } from '@fitness-tracker/shared';

export const HealthCorrelations: React.FC = () => {
  const { correlations } = useHealthStore();

  const getTrendColor = (trend: HealthCorrelation['trend']) => {
    switch (trend) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  if (correlations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold mb-2">No Correlations Yet</h3>
        <p className="text-gray-600">
          Track more health and fitness data to discover correlations between your metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Health & Fitness Correlations</h2>
      
      {correlations.map((correlation, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {correlation.healthMetric} ↔ {correlation.fitnessMetric}
              </h3>
              <p className="text-gray-600">{correlation.description}</p>
            </div>
            <Badge className={getTrendColor(correlation.trend)}>
              {correlation.trend}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Correlation</div>
              <div className="text-gray-600">{correlation.correlation.toFixed(2)}</div>
            </div>
            <div>
              <div className="font-medium">Strength</div>
              <div className="text-gray-600">{getCorrelationStrength(correlation.correlation)}</div>
            </div>
            <div>
              <div className="font-medium">Confidence</div>
              <div className="text-gray-600">{(correlation.confidence * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="font-medium">Sample Size</div>
              <div className="text-gray-600">{correlation.sampleSize}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
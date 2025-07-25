import React from 'react';
import { Card, Button, Badge } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { HealthInsight } from '@fitness-tracker/shared';

export const HealthInsights: React.FC = () => {
  const { insights, dismissInsight } = useHealthStore();

  const activeInsights = insights.filter(insight => !insight.dismissed);

  const getSeverityColor = (severity: HealthInsight['severity']) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeInsights.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🧠</div>
        <h3 className="text-lg font-semibold mb-2">No Active Insights</h3>
        <p className="text-gray-600">
          Start tracking your health metrics to receive personalized insights and recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Health Insights</h2>
      
      {activeInsights.map((insight) => (
        <Card key={insight.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Badge className={getSeverityColor(insight.severity)}>
                {insight.severity}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(insight.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dismissInsight(insight.id)}
            >
              Dismiss
            </Button>
          </div>

          <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
          <p className="text-gray-600 mb-4">{insight.description}</p>

          {insight.recommendations && insight.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {insight.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Based on {insight.dataPoints.sampleSize} data points
          </div>
        </Card>
      ))}
    </div>
  );
}; 
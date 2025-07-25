import React, { useState } from 'react';
import { Card, Button, Input } from '@fitness-tracker/ui';
import { useHealthStore, useAuthStore } from '@fitness-tracker/store';
import { HealthService } from '../../lib/health';
import type { BloodGlucoseData } from '@fitness-tracker/shared';

export const BloodGlucoseTracker: React.FC = () => {
  const { addBloodGlucoseLog, getBloodGlucoseTrends } = useHealthStore();
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reading, setReading] = useState(100);
  const [timeOfDay, setTimeOfDay] = useState<BloodGlucoseData['timeOfDay']>('fasting');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgTrends = getBloodGlucoseTrends();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.userId) {
      console.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bgData: BloodGlucoseData = {
        reading,
        timeOfDay,
        medicationTaken: false,
      };

      // Save to local store (immediate UI update)
      addBloodGlucoseLog(bgData, date, notes);
      
      // Save to Firebase (persistent storage)
      await HealthService.addBloodGlucoseLog(user.userId, bgData, date, notes);
      
      // Reset form
      setReading(100);
      setTimeOfDay('fasting');
      setNotes('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to save blood glucose log:', error);
      // You could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🩸 Blood Glucose Tracker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Log BG'}
        </Button>
      </div>

      {/* BG Summary */}
      <div className="mb-4 p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-purple-800">
          <div><strong>Average:</strong> {bgTrends.averageReading} mg/dL</div>
          <div><strong>Range:</strong> {bgTrends.range.min}-{bgTrends.range.max} mg/dL</div>
          <div><strong>Trend:</strong> {bgTrends.trend}</div>
        </div>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reading (mg/dL)</label>
            <Input
              type="number"
              value={reading}
              onChange={(e) => setReading(parseInt(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as BloodGlucoseData['timeOfDay'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="fasting">Fasting</option>
              <option value="beforeMeal">Before Meal</option>
              <option value="afterMeal">After Meal</option>
              <option value="bedtime">Bedtime</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Log Blood Glucose'}
          </Button>
        </form>
      )}
    </Card>
  );
}; 
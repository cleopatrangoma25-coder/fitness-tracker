import React, { useState } from 'react';
import { Card, Button, Input } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { PainData, PainLocation } from '@fitness-tracker/shared';

export const PainTracker: React.FC = () => {
  const { addPainLog, getPainTrends } = useHealthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [intensity, setIntensity] = useState<PainData['intensity']>(5);
  const [painType, setPainType] = useState<PainData['type']>('soreness');
  const [location, setLocation] = useState<PainLocation['area']>('back');
  const [notes, setNotes] = useState('');

  const painTrends = getPainTrends();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const painData: PainData = {
      location: [{ area: location }],
      intensity,
      type: painType,
      duration: 'acute',
      affectsWorkout: intensity > 5,
      ...(notes && { notes }),
    };

    addPainLog(painData, date, notes || undefined);
    
    // Reset form
    setIntensity(5);
    setPainType('soreness');
    setLocation('back');
    setNotes('');
    setIsExpanded(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🩹 Pain & Soreness Tracker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Log Pain'}
        </Button>
      </div>

      {/* Pain Summary */}
      <div className="mb-4 p-3 bg-red-50 rounded-lg">
        <div className="text-sm text-red-800">
          <div><strong>Most Common:</strong> {painTrends.mostCommonLocation}</div>
          <div><strong>Average Intensity:</strong> {painTrends.averageIntensity}/10</div>
          <div><strong>Frequency:</strong> {painTrends.frequency}</div>
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
            <label className="block text-sm font-medium mb-1">Pain Intensity (1-10)</label>
            <Input
              type="number"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value) as PainData['intensity'])}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pain Type</label>
            <select
              value={painType}
              onChange={(e) => setPainType(e.target.value as PainData['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="soreness">Soreness</option>
              <option value="sharp">Sharp</option>
              <option value="dull">Dull</option>
              <option value="throbbing">Throbbing</option>
              <option value="burning">Burning</option>
              <option value="tingling">Tingling</option>
              <option value="numbness">Numbness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as PainLocation['area'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="head">Head</option>
              <option value="neck">Neck</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="hands">Hands</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="abdomen">Abdomen</option>
              <option value="hips">Hips</option>
              <option value="legs">Legs</option>
              <option value="knees">Knees</option>
              <option value="feet">Feet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the pain, triggers, etc..."
            />
          </div>

          <Button type="submit" className="w-full">
            Log Pain Data
          </Button>
        </form>
      )}
    </Card>
  );
}; 
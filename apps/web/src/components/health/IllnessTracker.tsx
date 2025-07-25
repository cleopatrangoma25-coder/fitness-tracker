import React, { useState } from 'react';
import { Card, Button, Input } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { IllnessData } from '@fitness-tracker/shared';

export const IllnessTracker: React.FC = () => {
  const { addIllnessLog, getIllnessTrends } = useHealthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState<IllnessData['severity']>('mild');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const illnessTrends = getIllnessTrends();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const illnessData: IllnessData = {
      symptoms: symptoms.map(symptom => ({ type: symptom as any, intensity: 3 })),
      severity,
      affectsWorkout: severity !== 'mild',
    };

    addIllnessLog(illnessData, date, notes || undefined);
    
    // Reset form
    setSeverity('mild');
    setSymptoms([]);
    setNotes('');
    setIsExpanded(false);
  };

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms(prev => [...prev, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🌡️ Illness Tracker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Log Illness'}
        </Button>
      </div>

      {/* Illness Summary */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
        <div className="text-sm text-yellow-800">
          <div><strong>Frequency:</strong> {illnessTrends.frequency}</div>
          <div><strong>Common Symptoms:</strong> {illnessTrends.commonSymptoms.join(', ') || 'None'}</div>
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
            <label className="block text-sm font-medium mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IllnessData['severity'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Symptoms</label>
            <div className="space-y-2">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{symptom}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSymptom(symptom)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {['fever', 'headache', 'cough', 'soreThroat', 'fatigue', 'bodyAches'].map((symptom) => (
                  <Button
                    key={symptom}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSymptom(symptom)}
                  >
                    Add {symptom}
                  </Button>
                ))}
              </div>
            </div>
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

          <Button type="submit" className="w-full">
            Log Illness Data
          </Button>
        </form>
      )}
    </Card>
  );
}; 
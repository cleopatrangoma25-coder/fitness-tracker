import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { MenstrualData, MenstrualSymptom } from '@fitness-tracker/shared';

export const MenstrualTracker: React.FC = () => {
  const { addMenstrualLog, getMenstrualCycleData } = useHealthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [phase, setPhase] = useState<MenstrualData['phase']>('menstrual');
  const [flow, setFlow] = useState<MenstrualData['flow']>('medium');
  const [energy, setEnergy] = useState<MenstrualData['energy']>(3);
  const [mood, setMood] = useState<MenstrualData['mood']>(3);
  const [symptoms, setSymptoms] = useState<MenstrualSymptom[]>([]);
  const [notes, setNotes] = useState('');

  const cycleData = getMenstrualCycleData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const menstrualData: MenstrualData = {
      phase,
      flow,
      symptoms,
      energy,
      mood,
      cramps: symptoms.some(s => s.type === 'cramps'),
      bloating: symptoms.some(s => s.type === 'bloating'),
      breastTenderness: symptoms.some(s => s.type === 'breastTenderness'),
      backPain: symptoms.some(s => s.type === 'backPain'),
      fatigue: symptoms.some(s => s.type === 'fatigue'),
      foodCravings: symptoms.some(s => s.type === 'foodCravings'),
    };

    addMenstrualLog(menstrualData, date, notes || undefined);
    
    // Reset form
    setPhase('menstrual');
    setFlow('medium');
    setEnergy(3);
    setMood(3);
    setSymptoms([]);
    setNotes('');
    setIsExpanded(false);
  };

  const addSymptom = (type: MenstrualSymptom['type'], intensity: MenstrualSymptom['intensity']) => {
    setSymptoms(prev => [...prev, { type, intensity }]);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🩸 Menstrual Cycle Tracker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Log Entry'}
        </Button>
      </div>

      {/* Cycle Summary */}
      <div className="mb-4 p-3 bg-pink-50 rounded-lg">
        <div className="text-sm text-pink-800">
          <div><strong>Cycle Length:</strong> {cycleData.cycleLength} days</div>
          <div><strong>Average Flow:</strong> {cycleData.averageFlow}</div>
          {cycleData.commonSymptoms.length > 0 && (
            <div><strong>Common Symptoms:</strong> {cycleData.commonSymptoms.join(', ')}</div>
          )}
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
            <label className="block text-sm font-medium mb-1">Phase</label>
            <Select
              value={phase}
              onChange={(value) => setPhase(value as MenstrualData['phase'])}
              options={[
                { value: 'menstrual', label: 'Menstrual' },
                { value: 'follicular', label: 'Follicular' },
                { value: 'ovulatory', label: 'Ovulatory' },
                { value: 'luteal', label: 'Luteal' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Flow</label>
            <Select
              value={flow}
              onChange={(value) => setFlow(value as MenstrualData['flow'])}
              options={[
                { value: 'none', label: 'None' },
                { value: 'spotting', label: 'Spotting' },
                { value: 'light', label: 'Light' },
                { value: 'medium', label: 'Medium' },
                { value: 'heavy', label: 'Heavy' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Energy Level</label>
              <Select
                value={energy.toString()}
                onChange={(value) => setEnergy(parseInt(value) as MenstrualData['energy'])}
                options={[
                  { value: '1', label: 'Very Low' },
                  { value: '2', label: 'Low' },
                  { value: '3', label: 'Normal' },
                  { value: '4', label: 'High' },
                  { value: '5', label: 'Very High' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mood</label>
              <Select
                value={mood.toString()}
                onChange={(value) => setMood(parseInt(value) as MenstrualData['mood'])}
                options={[
                  { value: '1', label: 'Very Low' },
                  { value: '2', label: 'Low' },
                  { value: '3', label: 'Normal' },
                  { value: '4', label: 'Good' },
                  { value: '5', label: 'Excellent' }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Symptoms</label>
            <div className="space-y-2">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{symptom.type} (Intensity: {symptom.intensity})</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSymptom(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {['cramps', 'bloating', 'breastTenderness', 'backPain', 'fatigue', 'foodCravings'].map((symptomType) => (
                  <Button
                    key={symptomType}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSymptom(symptomType as MenstrualSymptom['type'], 3)}
                  >
                    Add {symptomType}
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
            Log Menstrual Data
          </Button>
        </form>
      )}
    </Card>
  );
}; 
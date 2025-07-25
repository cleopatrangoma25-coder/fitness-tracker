import React, { useState } from 'react';
import { Card, Button, Input } from '@fitness-tracker/ui';
import { useHealthStore } from '@fitness-tracker/store';
import type { BloodPressureData } from '@fitness-tracker/shared';

export const BloodPressureTracker: React.FC = () => {
  const { addBloodPressureLog, getBloodPressureTrends } = useHealthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [pulse, setPulse] = useState(72);
  const [timeOfDay, setTimeOfDay] = useState<BloodPressureData['timeOfDay']>('morning');
  const [notes, setNotes] = useState('');

  const bpTrends = getBloodPressureTrends();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bpData: BloodPressureData = {
      systolic,
      diastolic,
      pulse,
      timeOfDay,
      position: 'sitting',
      medicationTaken: false,
    };

    addBloodPressureLog(bpData, date, notes || undefined);
    
    // Reset form
    setSystolic(120);
    setDiastolic(80);
    setPulse(72);
    setTimeOfDay('morning');
    setNotes('');
    setIsExpanded(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">💓 Blood Pressure Tracker</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Log BP'}
        </Button>
      </div>

      {/* BP Summary */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <div><strong>Average:</strong> {bpTrends.averageSystolic}/{bpTrends.averageDiastolic} mmHg</div>
          <div><strong>Trend:</strong> {bpTrends.trend}</div>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Systolic</label>
              <Input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diastolic</label>
              <Input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pulse</label>
              <Input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as BloodPressureData['timeOfDay'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
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

          <Button type="submit" className="w-full">
            Log Blood Pressure
          </Button>
        </form>
      )}
    </Card>
  );
}; 
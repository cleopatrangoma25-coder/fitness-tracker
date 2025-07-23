import React from 'react';
import { Card } from '@fitness-tracker/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ProgressData {
  date: string;
  workouts: number;
  exercises: number;
  totalVolume: number;
  duration: number;
}

interface MuscleGroupData {
  muscleGroup: string;
  count: number;
  percentage: number;
  color: string;
}

interface ProgressChartsProps {
  weeklyData: ProgressData[];
  muscleGroupData: MuscleGroupData[];
  personalRecords: Array<{
    exerciseName: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    lastAchieved: Date;
  }>;
}

const COLORS = ['#0ea5e9', '#f97316', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  weeklyData,
  muscleGroupData,
  personalRecords,
}) => {
  return (
    <div className="space-y-8">
      {/* Weekly Progress Overview */}
      <Card variant="elevated" className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">📈 Weekly Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">Your workout activity over the past 8 weeks</p>
          </div>
          <div className="text-2xl">📊</div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="workouts"
                stroke="#0ea5e9"
                fill="url(#workoutGradient)"
                strokeWidth={2}
                name="Workouts"
              />
              <Area
                type="monotone"
                dataKey="totalVolume"
                stroke="#f97316"
                fill="url(#volumeGradient)"
                strokeWidth={2}
                name="Total Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Muscle Group Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card variant="elevated" className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">💪 Muscle Group Focus</h3>
              <p className="text-gray-600 dark:text-gray-400">Distribution of your workout focus</p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Personal Records */}
        <Card variant="elevated" className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">🏆 Personal Records</h3>
              <p className="text-gray-600 dark:text-gray-400">Your best performances</p>
            </div>
            <div className="text-2xl">🥇</div>
          </div>
          
          <div className="space-y-4">
            {personalRecords.slice(0, 5).map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {record.exerciseName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {record.maxWeight}kg × {record.maxReps} reps
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {record.maxVolume}kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(record.lastAchieved).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Exercise Volume Trends */}
      <Card variant="elevated" className="p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">📊 Exercise Volume Trends</h3>
            <p className="text-gray-600 dark:text-gray-400">Volume progression over time</p>
          </div>
          <div className="text-2xl">📈</div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar 
                dataKey="exercises" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
                name="Exercises"
              />
              <Bar 
                dataKey="duration" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                name="Duration (min)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}; 
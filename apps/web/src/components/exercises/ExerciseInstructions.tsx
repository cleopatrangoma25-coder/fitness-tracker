import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

interface ExerciseInstruction {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  tips: string[];
  variations: string[];
  safetyNotes: string[];
  videoUrl?: string;
  imageUrl?: string;
}

interface ExerciseInstructionsProps {
  exercise: ExerciseInstruction;
  onClose: () => void;
}

const EXERCISE_INSTRUCTIONS: { [key: string]: ExerciseInstruction } = {
  'Push-ups': {
    name: 'Push-ups',
    difficulty: 'Beginner',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    equipment: ['None'],
    instructions: [
      'Start in a plank position with your hands slightly wider than shoulder-width apart',
      'Lower your body until your chest nearly touches the floor',
      'Keep your body in a straight line from head to heels',
      'Push back up to the starting position',
      'Repeat for the desired number of repetitions'
    ],
    tips: [
      'Keep your core engaged throughout the movement',
      'Breathe out as you push up, breathe in as you lower down',
      'Keep your elbows close to your body',
      'Don\'t let your hips sag or rise'
    ],
    variations: [
      'Knee push-ups (easier)',
      'Diamond push-ups (harder)',
      'Decline push-ups (harder)',
      'Incline push-ups (easier)'
    ],
    safetyNotes: [
      'Stop if you feel pain in your wrists or shoulders',
      'Maintain proper form to avoid injury',
      'Don\'t rush the movement'
    ]
  },
  'Squats': {
    name: 'Squats',
    difficulty: 'Beginner',
    muscleGroups: ['Legs', 'Glutes', 'Core'],
    equipment: ['None'],
    instructions: [
      'Stand with your feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind your toes',
      'Lower until your thighs are parallel to the floor',
      'Push through your heels to return to standing'
    ],
    tips: [
      'Keep your weight in your heels',
      'Don\'t let your knees cave inward',
      'Keep your chest up throughout the movement',
      'Breathe steadily throughout the exercise'
    ],
    variations: [
      'Bodyweight squats',
      'Jump squats',
      'Pistol squats (advanced)',
      'Sumo squats'
    ],
    safetyNotes: [
      'Keep your knees aligned with your toes',
      'Don\'t let your knees go past your toes',
      'Stop if you feel knee pain'
    ]
  },
  'Pull-ups': {
    name: 'Pull-ups',
    difficulty: 'Advanced',
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    equipment: ['Pull-up bar'],
    instructions: [
      'Grab the pull-up bar with your hands slightly wider than shoulder-width',
      'Hang with your arms fully extended',
      'Pull your body up until your chin is over the bar',
      'Lower yourself back down with control',
      'Repeat for the desired number of repetitions'
    ],
    tips: [
      'Engage your back muscles, not just your arms',
      'Keep your core tight throughout the movement',
      'Don\'t swing or use momentum',
      'Lower yourself slowly and with control'
    ],
    variations: [
      'Assisted pull-ups (with resistance band)',
      'Negative pull-ups (jump up, lower slowly)',
      'Wide grip pull-ups',
      'Close grip pull-ups'
    ],
    safetyNotes: [
      'Make sure the pull-up bar is secure',
      'Don\'t let go of the bar while hanging',
      'Stop if you feel shoulder pain'
    ]
  },
  'Deadlifts': {
    name: 'Deadlifts',
    difficulty: 'Intermediate',
    muscleGroups: ['Back', 'Legs', 'Glutes', 'Core'],
    equipment: ['Barbell', 'Weight plates'],
    instructions: [
      'Stand with your feet hip-width apart, bar over your midfoot',
      'Bend at your hips and knees to lower your hands to the bar',
      'Grip the bar with your hands shoulder-width apart',
      'Keep your back straight and chest up',
      'Stand up by pushing through your heels and extending your hips'
    ],
    tips: [
      'Keep the bar close to your body throughout the movement',
      'Engage your core and keep your back straight',
      'Push through your heels, not your toes',
      'Breathe out as you lift, breathe in as you lower'
    ],
    variations: [
      'Romanian deadlifts',
      'Sumo deadlifts',
      'Single-leg deadlifts',
      'Dumbbell deadlifts'
    ],
    safetyNotes: [
      'Never round your back during the lift',
      'Start with lighter weights to perfect form',
      'Stop immediately if you feel back pain'
    ]
  },
  'Bench Press': {
    name: 'Bench Press',
    difficulty: 'Intermediate',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench', 'Weight plates'],
    instructions: [
      'Lie on the bench with your feet flat on the floor',
      'Grip the bar slightly wider than shoulder-width',
      'Unrack the bar and lower it to your chest',
      'Press the bar back up to the starting position',
      'Repeat for the desired number of repetitions'
    ],
    tips: [
      'Keep your shoulder blades retracted',
      'Keep your feet flat on the floor',
      'Don\'t bounce the bar off your chest',
      'Control the movement throughout'
    ],
    variations: [
      'Dumbbell bench press',
      'Incline bench press',
      'Decline bench press',
      'Close grip bench press'
    ],
    safetyNotes: [
      'Always use a spotter when lifting heavy',
      'Don\'t arch your back excessively',
      'Stop if you feel shoulder or chest pain'
    ]
  }
};

export const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exercise, onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'tips' | 'variations' | 'safety'>('instructions');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: '📋' },
    { id: 'tips', label: 'Tips', icon: '💡' },
    { id: 'variations', label: 'Variations', icon: '🔄' },
    { id: 'safety', label: 'Safety', icon: '⚠️' }
  ] as const;

  return (
    <Card className="p-6 max-w-4xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{exercise.name}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
          <Button title="Close" variant="outline" size="small" onClick={onClose} />
        </div>

        {/* Exercise Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Muscles Worked</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((muscle, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded text-sm">
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.length > 0 ? (
                exercise.equipment.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded text-sm">
                    {item}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-sm">
                  Bodyweight
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Step-by-Step Instructions</h3>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Tips</h3>
              <ul className="space-y-3">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full flex items-center justify-center text-xs">
                      💡
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'variations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercise Variations</h3>
              <ul className="space-y-3">
                {exercise.variations.map((variation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-full flex items-center justify-center text-xs">
                      🔄
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{variation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Safety Notes</h3>
              <ul className="space-y-3">
                {exercise.safetyNotes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full flex items-center justify-center text-xs">
                      ⚠️
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 
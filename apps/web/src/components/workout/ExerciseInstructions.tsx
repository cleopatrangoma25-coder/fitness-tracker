import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

interface ExerciseInstructionsProps {
  exerciseName: string;
  onClose: () => void;
}

interface ExerciseInstruction {
  name: string;
  steps: string[];
  tips: string[];
  muscles: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const EXERCISE_INSTRUCTIONS: { [key: string]: ExerciseInstruction } = {
  'Push-ups': {
    name: 'Push-ups',
    steps: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until your chest nearly touches the floor',
      'Keep your core tight and body in a straight line',
      'Push back up to the starting position',
      'Repeat for the desired number of reps'
    ],
    tips: [
      'Keep your neck neutral - don\'t look up or down',
      'Breathe out as you push up, breathe in as you lower',
      'If too difficult, start with knee push-ups',
      'Focus on controlled movement, not speed'
    ],
    muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    equipment: [],
    difficulty: 'Beginner'
  },
  'Bench Press': {
    name: 'Bench Press',
    steps: [
      'Lie on bench with feet flat on the ground',
      'Grip barbell slightly wider than shoulder width',
      'Unrack the bar and lower it to your chest',
      'Press the bar back up to starting position',
      'Keep your back flat against the bench throughout'
    ],
    tips: [
      'Keep your shoulder blades retracted',
      'Drive through your feet for stability',
      'Control the descent, explode on the press',
      'Have a spotter for heavy weights'
    ],
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'Intermediate'
  },
  'Squats': {
    name: 'Squats',
    steps: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Lower until thighs are parallel to ground',
      'Push through your heels to stand back up'
    ],
    tips: [
      'Keep your weight in your heels',
      'Don\'t let your knees cave inward',
      'Breathe deeply throughout the movement',
      'Start with bodyweight before adding weight'
    ],
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: [],
    difficulty: 'Beginner'
  },
  'Pull-ups': {
    name: 'Pull-ups',
    steps: [
      'Hang from pull-up bar with hands shoulder-width apart',
      'Pull your body up until chin is over the bar',
      'Lower your body back down with control',
      'Keep your core engaged throughout',
      'Repeat for desired number of reps'
    ],
    tips: [
      'Start with assisted pull-ups if needed',
      'Focus on pulling with your back, not arms',
      'Don\'t swing or use momentum',
      'Full range of motion is key'
    ],
    muscles: ['Back', 'Biceps', 'Shoulders'],
    equipment: ['Pull-up bar'],
    difficulty: 'Intermediate'
  },
  'Deadlifts': {
    name: 'Deadlifts',
    steps: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip the bar',
      'Keep your back straight and chest up',
      'Stand up by driving through your heels',
      'Lower the bar back down with control'
    ],
    tips: [
      'Keep the bar close to your body',
      'Don\'t round your back',
      'Start with lighter weights to perfect form',
      'Focus on hip hinge movement'
    ],
    muscles: ['Back', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell'],
    difficulty: 'Advanced'
  },
  'Bicep Curls': {
    name: 'Bicep Curls',
    steps: [
      'Stand with dumbbells at your sides',
      'Curl the weights up toward your shoulders',
      'Keep your elbows close to your body',
      'Lower the weights back down with control',
      'Repeat for desired number of reps'
    ],
    tips: [
      'Don\'t swing your body for momentum',
      'Keep your wrists straight',
      'Focus on the bicep contraction',
      'Control both the up and down movement'
    ],
    muscles: ['Biceps', 'Forearms'],
    equipment: ['Dumbbells'],
    difficulty: 'Beginner'
  }
};

export const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({
  exerciseName,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const instruction = EXERCISE_INSTRUCTIONS[exerciseName] || {
    name: exerciseName,
    steps: ['Instructions not available for this exercise.'],
    tips: ['Focus on proper form and controlled movement.'],
    muscles: ['Various muscle groups'],
    equipment: [],
    difficulty: 'Beginner' as const
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{instruction.name}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(instruction.difficulty)}`}>
              {instruction.difficulty}
            </span>
          </div>
          <Button title="Close" variant="outline" size="small" onClick={onClose} />
        </div>

        {/* Exercise Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Muscles Worked</h3>
            <div className="flex flex-wrap gap-2">
              {instruction.muscles.map((muscle, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {instruction.equipment.length > 0 ? (
                instruction.equipment.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {item}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  Bodyweight
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">How to Perform</h3>
          <div className="space-y-3">
            {instruction.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
          <div className="space-y-2">
            {instruction.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Safety First</h4>
          <p className="text-yellow-700 text-sm">
            Always warm up properly before exercising. If you experience pain, stop immediately and consult a professional. 
            Start with lighter weights and focus on proper form before increasing intensity.
          </p>
        </div>
      </div>
    </Card>
  );
}; 
import React, { useState, useEffect } from 'react';
import { Card, Button } from '@fitness-tracker/ui';
import './exercise-animations.css';

interface AnimatedExerciseProps {
  exerciseName: string;
  onClose: () => void;
}

interface ExerciseAnimation {
  name: string;
  duration: number;
  steps: AnimationStep[];
  muscleGroups: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface AnimationStep {
  name: string;
  duration: number;
  description: string;
  animation: string;
}

const EXERCISE_ANIMATIONS: { [key: string]: ExerciseAnimation } = {
  'Push-ups': {
    name: 'Push-ups',
    duration: 3000,
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    difficulty: 'Beginner',
    steps: [
      {
        name: 'Starting Position',
        duration: 1000,
        description: 'Plank position with arms extended',
        animation: 'pushup-start'
      },
      {
        name: 'Lowering Phase',
        duration: 1000,
        description: 'Lower body until chest nearly touches floor',
        animation: 'pushup-down'
      },
      {
        name: 'Pushing Phase',
        duration: 1000,
        description: 'Push back up to starting position',
        animation: 'pushup-up'
      }
    ]
  },
  'Squats': {
    name: 'Squats',
    duration: 4000,
    muscleGroups: ['Legs', 'Glutes', 'Core'],
    difficulty: 'Beginner',
    steps: [
      {
        name: 'Starting Position',
        duration: 1000,
        description: 'Stand with feet shoulder-width apart',
        animation: 'squat-start'
      },
      {
        name: 'Lowering Phase',
        duration: 1500,
        description: 'Lower body as if sitting back',
        animation: 'squat-down'
      },
      {
        name: 'Rising Phase',
        duration: 1500,
        description: 'Push through heels to return to standing',
        animation: 'squat-up'
      }
    ]
  },
  'Pull-ups': {
    name: 'Pull-ups',
    duration: 3500,
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    difficulty: 'Advanced',
    steps: [
      {
        name: 'Hanging Position',
        duration: 1000,
        description: 'Hang with arms fully extended',
        animation: 'pullup-hang'
      },
      {
        name: 'Pulling Phase',
        duration: 1250,
        description: 'Pull body up until chin over bar',
        animation: 'pullup-up'
      },
      {
        name: 'Lowering Phase',
        duration: 1250,
        description: 'Lower with control to starting position',
        animation: 'pullup-down'
      }
    ]
  },
  'Plank': {
    name: 'Plank',
    duration: 5000,
    muscleGroups: ['Core', 'Shoulders', 'Back'],
    difficulty: 'Beginner',
    steps: [
      {
        name: 'Setup',
        duration: 1000,
        description: 'Get into plank position',
        animation: 'plank-setup'
      },
      {
        name: 'Hold',
        duration: 3000,
        description: 'Maintain straight body line',
        animation: 'plank-hold'
      },
      {
        name: 'Release',
        duration: 1000,
        description: 'Lower to ground',
        animation: 'plank-release'
      }
    ]
  },
  'Lunges': {
    name: 'Lunges',
    duration: 4000,
    muscleGroups: ['Legs', 'Glutes', 'Core'],
    difficulty: 'Beginner',
    steps: [
      {
        name: 'Starting Position',
        duration: 1000,
        description: 'Stand with feet together',
        animation: 'lunge-start'
      },
      {
        name: 'Step Forward',
        duration: 1500,
        description: 'Step forward and lower into lunge',
        animation: 'lunge-forward'
      },
      {
        name: 'Return',
        duration: 1500,
        description: 'Push back to starting position',
        animation: 'lunge-return'
      }
    ]
  }
};

export const AnimatedExercise: React.FC<AnimatedExerciseProps> = ({ exerciseName, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const exercise = EXERCISE_ANIMATIONS[exerciseName];

  useEffect(() => {
    if (!isPlaying || !exercise) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          setIsPlaying(false);
          setProgress(0);
          setCurrentStep(0);
          return 0;
        }
        return newProgress;
      });
    }, exercise.duration / 10);

    return () => clearInterval(interval);
  }, [isPlaying, exercise]);

  useEffect(() => {
    if (!exercise) return;
    
    const stepDuration = exercise.duration / exercise.steps.length;
    const currentStepIndex = Math.floor((progress / 100) * exercise.steps.length);
    setCurrentStep(Math.min(currentStepIndex, exercise.steps.length - 1));
  }, [progress, exercise]);

  const handlePlay = () => {
    setIsPlaying(true);
    setProgress(0);
    setCurrentStep(0);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentStep(0);
  };

  if (!exercise) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Exercise Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Animation for "{exerciseName}" is not available yet.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {exercise.name} Animation
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                exercise.difficulty === 'Beginner' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' :
                exercise.difficulty === 'Intermediate' ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20' :
                'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
              }`}>
                {exercise.difficulty}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {exercise.muscleGroups.join(', ')}
              </span>
            </div>
          </div>
          <Button title="Close" variant="outline" size="small" onClick={onClose} />
        </div>

        {/* Animation Container */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Exercise Animation SVG */}
            <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
              <ExerciseAnimation 
                exercise={exercise} 
                currentStep={currentStep} 
                isPlaying={isPlaying}
              />
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step Info */}
            {exercise.steps[currentStep] && (
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {exercise.steps[currentStep].name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {exercise.steps[currentStep].description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isPlaying ? (
            <Button onClick={handlePlay} className="flex items-center gap-2">
              <span>▶️</span>
              Play Animation
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
              <span>⏸️</span>
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <span>🔄</span>
            Reset
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {exercise.steps.map((step, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={step.name}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Exercise Animation Component
interface ExerciseAnimationProps {
  exercise: ExerciseAnimation;
  currentStep: number;
  isPlaying: boolean;
}

const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ exercise, currentStep, isPlaying }) => {
  const step = exercise.steps[currentStep] || exercise.steps[0] || {
    name: 'Default',
    duration: 1000,
    description: 'Default step',
    animation: 'default'
  };

  const renderAnimation = () => {
    switch (exercise.name) {
      case 'Push-ups':
        return <PushupAnimation step={step} isPlaying={isPlaying} />;
      case 'Squats':
        return <SquatAnimation step={step} isPlaying={isPlaying} />;
      case 'Pull-ups':
        return <PullupAnimation step={step} isPlaying={isPlaying} />;
      case 'Plank':
        return <PlankAnimation step={step} isPlaying={isPlaying} />;
      case 'Lunges':
        return <LungeAnimation step={step} isPlaying={isPlaying} />;
      default:
        return <DefaultAnimation step={step} isPlaying={isPlaying} />;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderAnimation()}
    </div>
  );
};

// Individual Exercise Animations
const PushupAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (step.animation) {
      case 'pushup-start':
        return 'animate-pulse';
      case 'pushup-down':
        return 'animate-pushup-down';
      case 'pushup-up':
        return 'animate-pushup-up';
      default:
        return '';
    }
  };

  return (
    <div className="exercise-animation-container">
      <div className={`person-figure ${getAnimationClass()}`}>
        <div className="person-head"></div>
        <div className="person-body w-16 h-24">
          {/* Arms */}
          <div className={`person-arm top-4 -left-4 w-12 h-2 ${
            step.animation === 'pushup-down' ? 'rotate-45' : 
            step.animation === 'pushup-up' ? 'rotate-0' : 'rotate-0'
          } transition-transform duration-1000`}></div>
          <div className={`person-arm top-4 -right-4 w-12 h-2 ${
            step.animation === 'pushup-down' ? '-rotate-45' : 
            step.animation === 'pushup-up' ? 'rotate-0' : 'rotate-0'
          } transition-transform duration-1000`}></div>
          {/* Body */}
          <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-12 transition-all duration-1000 ${
            step.animation === 'pushup-down' ? 'scale-y-75' : 'scale-y-100'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

const SquatAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (step.animation) {
      case 'squat-start':
        return '';
      case 'squat-down':
        return 'animate-squat-down';
      case 'squat-up':
        return 'animate-squat-up';
      default:
        return '';
    }
  };

  const getSquatHeight = () => {
    switch (step.animation) {
      case 'squat-start':
        return 'h-24';
      case 'squat-down':
        return 'h-16';
      case 'squat-up':
        return 'h-20';
      default:
        return 'h-24';
    }
  };

  return (
    <div className="exercise-animation-container">
      <div className={`person-figure ${getAnimationClass()}`}>
        <div className="person-head"></div>
        <div className={`person-body w-16 ${getSquatHeight()} transition-all duration-1000`}>
          {/* Arms */}
          <div className="person-arm top-4 -left-4 w-12 h-2"></div>
          <div className="person-arm top-4 -right-4 w-12 h-2"></div>
          {/* Legs */}
          <div className="person-leg bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8"></div>
        </div>
      </div>
    </div>
  );
};

const PullupAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (step.animation) {
      case 'pullup-hang':
        return 'animate-pullup-hang';
      case 'pullup-up':
        return 'animate-pullup-up';
      case 'pullup-down':
        return 'animate-pullup-down';
      default:
        return '';
    }
  };

  const getPullupPosition = () => {
    switch (step.animation) {
      case 'pullup-hang':
        return 'translate-y-8';
      case 'pullup-up':
        return 'translate-y-0';
      case 'pullup-down':
        return 'translate-y-4';
      default:
        return 'translate-y-8';
    }
  };

  return (
    <div className="exercise-animation-container">
      {/* Bar */}
      <div className="absolute top-4 left-0 right-0 h-2 bg-gray-600 rounded"></div>
      {/* Person */}
      <div className={`person-figure transition-transform duration-1000 ${getPullupPosition()} ${getAnimationClass()}`}>
        <div className="person-head"></div>
        <div className="person-body w-12 h-16">
          {/* Arms */}
          <div className="person-arm top-2 -left-2 w-8 h-2"></div>
          <div className="person-arm top-2 -right-2 w-8 h-2"></div>
          {/* Body */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-8"></div>
        </div>
      </div>
    </div>
  );
};

const PlankAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (step.animation) {
      case 'plank-hold':
        return 'animate-plank-hold';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className="exercise-animation-container">
      <div className={`person-figure ${getAnimationClass()}`}>
        <div className="person-head"></div>
        <div className="person-body w-20 h-8">
          {/* Arms */}
          <div className="person-arm top-2 -left-4 w-6 h-2"></div>
          <div className="person-arm top-2 -right-4 w-6 h-2"></div>
          {/* Legs */}
          <div className="person-arm top-2 -left-2 w-4 h-2"></div>
          <div className="person-arm top-2 -right-2 w-4 h-2"></div>
        </div>
      </div>
    </div>
  );
};

const LungeAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (step.animation) {
      case 'lunge-start':
        return '';
      case 'lunge-forward':
        return 'animate-lunge-forward';
      case 'lunge-return':
        return 'animate-lunge-return';
      default:
        return '';
    }
  };

  const getLungePosition = () => {
    switch (step.animation) {
      case 'lunge-start':
        return 'translate-x-0';
      case 'lunge-forward':
        return 'translate-x-4';
      case 'lunge-return':
        return 'translate-x-2';
      default:
        return 'translate-x-0';
    }
  };

  return (
    <div className="exercise-animation-container">
      <div className={`person-figure transition-transform duration-1000 ${getLungePosition()} ${getAnimationClass()}`}>
        <div className="person-head"></div>
        <div className="person-body w-16 h-20">
          {/* Arms */}
          <div className="person-arm top-2 -left-2 w-8 h-2"></div>
          <div className="person-arm top-2 -right-2 w-8 h-2"></div>
          {/* Legs */}
          <div className="person-leg bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6"></div>
        </div>
      </div>
    </div>
  );
};

const DefaultAnimation: React.FC<{ step: AnimationStep; isPlaying: boolean }> = ({ step, isPlaying }) => {
  return (
    <div className="exercise-animation-container">
      <div className="text-center">
        <div className={`w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 ${isPlaying ? 'animate-pulse' : ''}`}></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{step.name}</p>
      </div>
    </div>
  );
}; 
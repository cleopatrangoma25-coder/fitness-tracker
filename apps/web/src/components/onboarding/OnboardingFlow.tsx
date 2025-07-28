import React, { useState } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Fitness Tracker!',
      description: 'Your personal fitness journey starts here',
      icon: '🎉',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Fitness Tracker!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Track your workouts, set goals, and see your progress over time. 
            Let's get you started with a quick tour of the app.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl mb-2">💪</div>
              <p className="text-sm text-gray-600">Log Workouts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">Set Goals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm text-gray-600">Track Progress</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workouts',
      title: 'Log Your Workouts',
      description: 'Track exercises, sets, and reps',
      icon: '💪',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Your Workouts</h3>
            <p className="text-gray-600">
              Record your exercises, sets, reps, and weights. 
              Build a complete history of your fitness journey.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">What you can track:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Exercise name and type</li>
              <li>• Sets, reps, and weight</li>
              <li>• Workout duration</li>
              <li>• Notes and comments</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Set Fitness Goals',
      description: 'Define your objectives and track progress',
      icon: '🎯',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Fitness Goals</h3>
            <p className="text-gray-600">
              Create specific, measurable goals to stay motivated 
              and track your progress over time.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Goal types:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Weight goals (gain/loss)</li>
              <li>• Strength goals (lift more weight)</li>
              <li>• Endurance goals (more reps/time)</li>
              <li>• Frequency goals (workouts per week)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'progress',
      title: 'Track Your Progress',
      description: 'Visualize your fitness journey',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Your Progress</h3>
            <p className="text-gray-600">
              View charts, statistics, and insights about your fitness journey. 
              See how far you've come and stay motivated.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Analytics you'll see:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Workout frequency trends</li>
              <li>• Strength progression charts</li>
              <li>• Personal records tracking</li>
              <li>• Goal completion rates</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: "You're All Set!",
      description: 'Ready to start your fitness journey',
      icon: '🚀',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900">You're All Set!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            You're ready to start your fitness journey! 
            Log your first workout or set your first goal to get started.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Next steps:</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Log your first workout</li>
              <li>• Set a fitness goal</li>
              <li>• Explore the dashboard</li>
              <li>• Update your profile</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentStepData.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              title="Previous"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            />
            <Button
              variant="primary"
              onClick={handleNext}>
          isLastStep ? "Get Started" : "Next"
        </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}; 
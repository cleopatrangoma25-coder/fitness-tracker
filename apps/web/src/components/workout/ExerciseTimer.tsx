import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

interface ExerciseTimerProps {
  exerciseName: string;
  recommendedDuration: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
  onPause: () => void;
  isPaused: boolean;
  currentSet: number;
  totalSets: number;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  exerciseName,
  recommendedDuration,
  onComplete,
  onSkip,
  onPause,
  isPaused,
  currentSet,
  totalSets
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    onPause();
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  const handleComplete = useCallback(() => {
    setIsActive(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const newTime = prevTime + 1;
          // Auto-complete when recommended duration is reached
          if (newTime >= recommendedDuration) {
            handleComplete();
            return newTime;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, recommendedDuration, handleComplete]);

  const progressPercentage = (timeElapsed / recommendedDuration) * 100;
  const timeRemaining = Math.max(0, recommendedDuration - timeElapsed);

  const getProgressColor = () => {
    if (progressPercentage < 50) return 'bg-green-500';
    if (progressPercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimeStatus = () => {
    if (timeElapsed < recommendedDuration * 0.5) return 'Getting Started';
    if (timeElapsed < recommendedDuration * 0.8) return 'Keep Going!';
    if (timeElapsed < recommendedDuration) return 'Almost Done!';
    return 'Time to Move On!';
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exercise Timer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">{exerciseName}</p>
          <p className="text-sm text-blue-600 font-medium">
            Set {currentSet} of {totalSets}
          </p>
        </div>

        {/* Timer Display */}
        <div className="space-y-4">
          <div className="text-6xl font-mono font-bold bg-gradient-primary bg-clip-text text-transparent">
            {formatTime(timeElapsed)}
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div
                className={`${getProgressColor()} h-3 rounded-full transition-all duration-1000 ease-linear shadow-sm`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Elapsed</span>
              <span>{formatTime(timeRemaining)} remaining</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-lg font-semibold text-gray-800">
            {getTimeStatus()}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePause}
            disabled={!isActive}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            title="Skip Exercise"
            variant="outline"
            onClick={handleSkip}
            disabled={!isActive}
          />
        </div>

        {/* Exercise Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-medium mb-2 text-blue-800">💪 Exercise Tips:</p>
          <ul className="text-left space-y-1 text-blue-700">
            <li>• Focus on proper form</li>
            <li>• Control your breathing</li>
            <li>• Feel the muscle engagement</li>
            <li>• Don't rush through the movement</li>
          </ul>
        </div>

        {/* Recommended Duration Info */}
        <div className="text-sm text-gray-600">
          <p>Recommended time: {formatTime(recommendedDuration)}</p>
          <p>This helps maintain proper form and intensity</p>
        </div>
      </div>
    </Card>
  );
}; 
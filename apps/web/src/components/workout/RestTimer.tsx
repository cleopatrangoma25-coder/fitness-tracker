import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '@fitness-tracker/ui';

interface RestTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  onSkip: () => void;
  exerciseName?: string;
  nextExercise?: string | undefined;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  duration,
  onComplete,
  onSkip,
  exerciseName,
  nextExercise
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
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

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, handleComplete]);

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rest Time</h2>
          {exerciseName && (
            <p className="text-gray-600 dark:text-gray-300">Just completed: {exerciseName}</p>
          )}
          {nextExercise && (
            <p className="text-blue-600 font-medium">Next: {nextExercise}</p>
          )}
        </div>

        {/* Timer Display */}
        <div className="space-y-4">
          <div className="text-6xl font-mono font-bold bg-gradient-primary bg-clip-text text-transparent">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-accent h-3 rounded-full transition-all duration-1000 ease-linear shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePause}
            disabled={!isActive || timeLeft === 0}>
          isPaused ? "Resume" : "Pause"
        </Button>
          <Button
            title="Skip Rest"
            variant="outline"
            onClick={handleSkip}
            disabled={!isActive}
          />
        </div>

        {/* Tips */}
        <div className="text-sm text-neutral-600 bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-200">
          <p className="font-medium mb-2 text-primary-700">💡 Rest Tips:</p>
          <ul className="text-left space-y-1">
            <li>• Take deep breaths to recover</li>
            <li>• Stay hydrated</li>
            <li>• Prepare for your next set</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}; 
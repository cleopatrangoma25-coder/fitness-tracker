import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  } | undefined;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button
          title={action.label}
          variant={action.variant || 'primary'}
          onClick={action.onClick}
        />
      )}
    </div>
  );
};

// Specific empty states for different contexts
export const NoWorkoutsEmptyState: React.FC<{ onStartWorkout: () => void }> = ({ onStartWorkout }) => (
  <EmptyState
    icon="💪"
    title="No workouts yet"
    description="Start your fitness journey by logging your first workout. Track your progress and see your improvements over time."
    action={{
      label: "Start Your First Workout",
      onClick: onStartWorkout,
      variant: 'primary'
    }}
  />
);

export const NoGoalsEmptyState: React.FC<{ onAddGoal: () => void }> = ({ onAddGoal }) => (
  <EmptyState
    icon="🎯"
    title="No goals set"
    description="Set your first fitness goal to start tracking your progress and stay motivated on your fitness journey."
    action={{
      label: "Set Your First Goal",
      onClick: onAddGoal,
      variant: 'primary'
    }}
  />
);

export const NoDataEmptyState: React.FC<{ 
  title: string; 
  description: string; 
  action?: { label: string; onClick: () => void } 
}> = ({ title, description, action }) => (
  <EmptyState
    icon="📊"
    title={title}
    description={description}
    action={action}
  />
);

export const ErrorEmptyState: React.FC<{ 
  title?: string; 
  description?: string; 
  onRetry?: () => void 
}> = ({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading your data. Please try again.",
  onRetry 
}) => (
  <EmptyState
    icon="⚠️"
    title={title}
    description={description}
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry,
      variant: 'outline'
    } : undefined}
  />
); 
import React from 'react';
import { cn } from '../utils';

export interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  className?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = 'large', text, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
      >
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'animate-spin rounded-full border-2 border-gray-300 border-t-blue-500',
              size === 'small' ? 'w-4 h-4' : 'w-8 h-8'
            )}
          />
          {text && (
            <p className="text-gray-600 mt-4 text-center">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Loading.displayName = 'Loading';

// Full page loading component
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loading size="large" text={text} />
  </div>
);

export { Loading }; 
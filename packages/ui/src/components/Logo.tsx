import React from 'react';
import { cn } from '../utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className,
  showTagline = false
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const getLogoSrc = () => {
    switch (variant) {
      case 'icon':
        return '/logo-icon.svg';
      case 'text':
        return '/logo-text.svg';
      case 'full':
      default:
        return '/logo.svg';
    }
  };

  if (variant === 'text') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('flex items-center', sizeClasses[size])}>
          <img 
            src="/logo-icon.svg" 
            alt="Fitness Tracker Icon" 
            className="h-full w-auto"
          />
        </div>
        <div className="flex flex-col">
          <span className={cn(
            'font-bold text-gray-900 dark:text-white',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl',
            size === 'xl' && 'text-3xl'
          )}>
            Fitness
          </span>
          <span className={cn(
            'font-medium text-gray-600 dark:text-gray-400',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl'
          )}>
            Tracker
          </span>
          {showTagline && (
            <span className={cn(
              'text-gray-500 dark:text-gray-500 font-normal',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}>
              Transform Your Journey
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      <img 
        src={getLogoSrc()} 
        alt="Fitness Tracker Logo" 
        className={cn('h-auto', sizeClasses[size])}
      />
    </div>
  );
}; 
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

  const IconSVG = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="24" cy="24" r="22" fill="url(#iconGradient)" stroke="#ffffff" strokeWidth="2"/>
      
      {/* Dumbbell icon */}
      <g transform="translate(12, 12)">
        {/* Left weight */}
        <circle cx="3" cy="12" r="3" fill="#ffffff"/>
        {/* Right weight */}
        <circle cx="21" cy="12" r="3" fill="#ffffff"/>
        {/* Bar */}
        <rect x="6" y="11" width="12" height="2" fill="#ffffff" rx="1"/>
        {/* Center grip */}
        <rect x="9" y="9" width="6" height="6" fill="#ffffff" rx="1"/>
      </g>
      
      {/* Small accent dots */}
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.6"/>
      <circle cx="36" cy="36" r="1.5" fill="#ffffff" opacity="0.6"/>
    </svg>
  );

  const FullLogoSVG = () => (
    <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="iconGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(5, 10)">
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="url(#iconGradient2)" stroke="#ffffff" strokeWidth="2"/>
        
        {/* Dumbbell icon */}
        <g transform="translate(10, 10)">
          {/* Left weight */}
          <circle cx="2" cy="10" r="2.5" fill="#ffffff"/>
          {/* Right weight */}
          <circle cx="18" cy="10" r="2.5" fill="#ffffff"/>
          {/* Bar */}
          <rect x="4.5" y="9" width="11" height="2" fill="#ffffff" rx="1"/>
          {/* Center grip */}
          <rect x="7.5" y="7.5" width="5" height="5" fill="#ffffff" rx="0.8"/>
        </g>
        
        {/* Small accent dots */}
        <circle cx="10" cy="10" r="1.2" fill="#ffffff" opacity="0.6"/>
        <circle cx="30" cy="30" r="1.2" fill="#ffffff" opacity="0.6"/>
      </g>
      
      {/* Text */}
      <g transform="translate(50, 0)">
        {/* Fitness */}
        <text x="0" y="25" fontFamily="Inter, system-ui, sans-serif" fontSize="24" fontWeight="700" fill="url(#logoGradient)">
          Fitness
        </text>
        
        {/* Tracker */}
        <text x="0" y="45" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="500" fill="#6b7280">
          Tracker
        </text>
      </g>
      
      {/* Tagline */}
      <text x="50" y="55" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="400" fill="#9ca3af">
        Transform Your Journey
      </text>
    </svg>
  );

  if (variant === 'text') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('flex items-center', sizeClasses[size])}>
          <IconSVG />
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

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center', className)}>
        <div className={cn(sizeClasses[size])}>
          <IconSVG />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn(sizeClasses[size])}>
        <FullLogoSVG />
      </div>
    </div>
  );
}; 
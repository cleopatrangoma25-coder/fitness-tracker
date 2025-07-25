import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const cardVariants = cva(
  'bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-neutral-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 backdrop-blur-sm',
  {
    variants: {
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-10',
      },
      variant: {
        default: 'bg-white dark:bg-gray-800',
        elevated: 'bg-gradient-to-br from-white to-neutral-50 dark:from-gray-800 dark:to-gray-700 shadow-medium hover:shadow-strong',
        accent: 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-700 shadow-glow',
        success: 'bg-gradient-to-br from-success-50 to-teal-50 dark:from-success-900/20 dark:to-teal-900/20 border-success-200 dark:border-success-700 shadow-glow-success',
        warning: 'bg-gradient-to-br from-warning-50 to-orange-50 dark:from-warning-900/20 dark:to-orange-900/20 border-warning-200 dark:border-warning-700',
        danger: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700',
        info: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700',
        glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/20 dark:border-gray-700/20 shadow-soft',
        dark: 'bg-neutral-900 text-white border-neutral-700',
        // New sophisticated variants
        surface: 'bg-gradient-surface dark:bg-gradient-dark-glass border-surface-200 dark:border-surface-700',
        hero: 'bg-gradient-hero text-white border-transparent shadow-glow-purple',
        sunset: 'bg-gradient-sunset text-white border-transparent shadow-glow-accent',
        ocean: 'bg-gradient-ocean text-white border-transparent shadow-glow',
        glassmorphism: 'bg-gradient-glass dark:bg-gradient-dark-glass backdrop-blur-xl border-white/30 dark:border-gray-600/30',
        premium: 'bg-gradient-to-br from-white via-neutral-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-strong border-neutral-100 dark:border-gray-600',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-strong transition-all duration-300',
        false: '',
      },
      bordered: {
        true: 'border-2',
        false: 'border',
      },
      animated: {
        true: 'animate-fade-in-up',
        false: '',
      },
      glow: {
        true: 'shadow-glow',
        primary: 'shadow-glow',
        accent: 'shadow-glow-accent',
        success: 'shadow-glow-success',
        purple: 'shadow-glow-purple',
        false: '',
      },
    },
    defaultVariants: {
      padding: 'md',
      variant: 'default',
      interactive: false,
      bordered: false,
      animated: false,
      glow: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  padding,
  variant,
  interactive,
  bordered,
  animated,
  glow,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(cardVariants({ padding, variant, interactive, bordered, animated, glow }), className)}
      {...props}
    >
      {children}
    </div>
  );
}; 
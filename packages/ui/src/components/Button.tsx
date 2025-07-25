import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-soft hover:shadow-medium active:shadow-strong',
  {
    variants: {
      variant: {
        default: 'bg-gradient-primary text-white hover:bg-gradient-accent transform hover:scale-105 shadow-glow hover:shadow-glow-accent',
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 shadow-glow',
        secondary: 'bg-gradient-to-r from-neutral-500 to-neutral-600 text-white hover:from-neutral-600 hover:to-neutral-700',
        accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 transform hover:scale-105 shadow-glow-accent',
        success: 'bg-gradient-to-r from-success-500 to-teal-500 text-white hover:from-success-600 hover:to-teal-600 shadow-glow-success',
        warning: 'bg-gradient-to-r from-warning-500 to-orange-500 text-white hover:from-warning-600 hover:to-orange-600',
        danger: 'bg-gradient-to-r from-danger-500 to-red-500 text-white hover:from-danger-600 hover:to-red-600',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
        outline: 'border-2 border-primary-500 bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-600 dark:hover:border-primary-400 hover:shadow-glow',
        ghost: 'bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:shadow-soft',
        link: 'bg-transparent text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline hover:text-primary-700 dark:hover:text-primary-300',
        subtle: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:shadow-soft',
        // New sophisticated variants
        hero: 'bg-gradient-hero text-white hover:bg-gradient-sunset transform hover:scale-105 shadow-glow-purple hover:shadow-glow-accent',
        sunset: 'bg-gradient-sunset text-white hover:bg-gradient-ocean transform hover:scale-105 shadow-glow-accent hover:shadow-glow',
        ocean: 'bg-gradient-ocean text-white hover:bg-gradient-hero transform hover:scale-105 shadow-glow hover:shadow-glow-purple',
        glass: 'bg-gradient-glass dark:bg-gradient-dark-glass backdrop-blur-md border border-white/20 dark:border-gray-600/20 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/20',
        premium: 'bg-gradient-to-r from-white via-neutral-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-neutral-200 dark:border-gray-600 text-gray-900 dark:text-white hover:shadow-strong',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
        xl: 'px-8 py-5 text-xl',
        '2xl': 'px-10 py-6 text-2xl',
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
      variant: 'default',
      size: 'md',
      animated: false,
      glow: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  title?: string; // Backward compatibility
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  animated,
  glow,
  loading = false,
  disabled,
  children,
  title, // Backward compatibility
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) => {
  // Use children if provided, otherwise use title for backward compatibility
  const content = children || title;
  
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, animated, glow }), 
        fullWidth && 'w-full',
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {content}
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
}; 
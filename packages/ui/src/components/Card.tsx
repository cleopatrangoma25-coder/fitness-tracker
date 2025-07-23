import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const cardVariants = cva(
  'bg-white rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 backdrop-blur-sm',
  {
    variants: {
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      variant: {
        default: 'bg-white',
        elevated: 'bg-gradient-to-br from-white to-neutral-50 shadow-2xl',
        accent: 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200',
        success: 'bg-gradient-to-br from-success-50 to-success-100 border-success-200',
        warning: 'bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200',
        danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
        info: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
        glass: 'bg-white/80 backdrop-blur-md border-white/20',
        dark: 'bg-neutral-900 text-white border-neutral-700',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105 active:scale-95',
        false: '',
      },
      bordered: {
        true: 'border-2',
        false: 'border',
      },
    },
    defaultVariants: {
      padding: 'md',
      variant: 'default',
      interactive: false,
      bordered: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  interactive?: boolean;
  bordered?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    padding, 
    variant, 
    interactive,
    bordered,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(cardVariants({ padding, variant, interactive, bordered, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants }; 
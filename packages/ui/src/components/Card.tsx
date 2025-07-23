import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const cardVariants = cva(
  'bg-white rounded-lg shadow-sm border border-gray-200',
  {
    variants: {
      padding: {
        small: 'p-3',
        medium: 'p-4',
        large: 'p-6',
      },
    },
    defaultVariants: {
      padding: 'medium',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, children, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ padding, className }))}
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
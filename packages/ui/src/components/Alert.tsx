import React from 'react'
import { cn } from '../utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-50 text-gray-900 border-gray-200',
      destructive: 'bg-red-50 text-red-900 border-red-200',
      success: 'bg-green-50 text-green-900 border-green-200',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription } 
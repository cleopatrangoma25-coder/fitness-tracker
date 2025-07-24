import React from 'react'
import { cn } from '../utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  error && "text-red-600"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox } 
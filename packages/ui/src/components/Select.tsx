import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const selectVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-neutral-300",
        error: "border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:ring-green-500",
      },
      selectSize: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      selectSize: "md",
    },
  }
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
  error?: string
  success?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant, 
    selectSize, 
    options, 
    placeholder, 
    onChange, 
    error,
    success,
    value,
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value)
    }

    const getVariant = () => {
      if (error) return "error"
      if (success) return "success"
      return variant
    }

    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(selectVariants({ variant: getVariant(), selectSize, className }))}
          onChange={handleChange}
          value={value}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(error || success) && (
          <p
            className={cn(
              "mt-1 text-xs",
              error && "text-red-600",
              success && "text-green-600"
            )}
          >
            {error || success}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select } 
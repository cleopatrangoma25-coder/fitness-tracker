import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white border-neutral-800",
        light: "bg-white text-neutral-900 border-neutral-200 shadow-lg",
        success: "bg-green-600 text-white border-green-700",
        warning: "bg-yellow-600 text-white border-yellow-700",
        destructive: "bg-red-600 text-white border-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, variant, content, children, position = "top", delay = 300, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [coords, setCoords] = React.useState({ x: 0, y: 0 })
    const timeoutRef = React.useRef<NodeJS.Timeout>()
    const tooltipRef = React.useRef<HTMLDivElement>(null)

    const showTooltip = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      let x = 0
      let y = 0

      switch (position) {
        case "top":
          x = rect.left + rect.width / 2
          y = rect.top - 8
          break
        case "bottom":
          x = rect.left + rect.width / 2
          y = rect.bottom + 8
          break
        case "left":
          x = rect.left - 8
          y = rect.top + rect.height / 2
          break
        case "right":
          x = rect.right + 8
          y = rect.top + rect.height / 2
          break
      }

      setCoords({ x, y })
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
    }

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const getPositionClasses = () => {
      switch (position) {
        case "top":
          return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
        case "bottom":
          return "top-full left-1/2 transform -translate-x-1/2 mt-2"
        case "left":
          return "right-full top-1/2 transform -translate-y-1/2 mr-2"
        case "right":
          return "left-full top-1/2 transform -translate-y-1/2 ml-2"
        default:
          return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
      }
    }

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              "absolute z-50 whitespace-nowrap",
              getPositionClasses(),
              tooltipVariants({ variant }),
              className
            )}
            style={{
              left: position === "left" || position === "right" ? "auto" : coords.x,
              top: position === "top" || position === "bottom" ? "auto" : coords.y,
            }}
          >
            {content}
            <div
              className={cn(
                "absolute w-2 h-2 bg-inherit transform rotate-45",
                position === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
                position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
                position === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
                position === "right" && "right-full top-1/2 -translate-y-1/2 -mr-1"
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip } 
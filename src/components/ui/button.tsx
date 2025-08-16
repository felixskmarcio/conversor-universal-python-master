import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { RefreshCw, Check, AlertCircle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 relative overflow-hidden group hover-lift active:scale-[0.98] transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/80 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:from-destructive/90 hover:to-destructive/80 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        outline:
          "border-2 border-border bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg hover:from-secondary/90 hover:to-secondary/80 hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-sm backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient:
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-xl hover:bg-white/20 hover:border-white/30 hover:shadow-2xl",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-lg",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },
      loading: {
        true: "cursor-not-allowed",
        false: "",
      },
      state: {
        idle: "",
        loading: "",
        success: "bg-green-500 hover:bg-green-600",
        error: "bg-red-500 hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
      state: "idle",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  state?: "idle" | "loading" | "success" | "error"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loadingText?: string
  successText?: string
  errorText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      state = "idle",
      leftIcon,
      rightIcon,
      loadingText,
      successText,
      errorText,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalState, setInternalState] = React.useState<"idle" | "loading" | "success" | "error">(state)
    const [isClicked, setIsClicked] = React.useState(false)

    React.useEffect(() => {
      setInternalState(state)
    }, [state])

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled || internalState === "loading") return
      
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 150)
      
      if (onClick) {
        onClick(e)
      }
    }

    const isLoading = loading || internalState === "loading"
    const isDisabled = disabled || isLoading

    const getStateIcon = () => {
      switch (internalState) {
        case "loading":
          return <Loader2 className="w-4 h-4 animate-spin" />
        case "success":
          return <Check className="w-4 h-4" />
        case "error":
          return <AlertCircle className="w-4 h-4" />
        default:
          return null
      }
    }

    const getStateText = () => {
      switch (internalState) {
        case "loading":
          return loadingText || "Carregando..."
        case "success":
          return successText || children
        case "error":
          return errorText || children
        default:
          return children
      }
    }

    const Comp = asChild ? Slot : "button"

    const buttonContent = (
      <>
        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span 
            className={cn(
              "absolute inset-0 rounded-inherit opacity-0 bg-white/20 transition-opacity duration-300",
              isClicked && "opacity-100"
            )} 
          />
        </span>

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {internalState !== "idle" && getStateIcon()}
          {leftIcon && internalState === "idle" && leftIcon}
          
          <span className={cn(
            "transition-all duration-200",
            isLoading && "opacity-0"
          )}>
            {getStateText()}
          </span>
          
          {rightIcon && internalState === "idle" && rightIcon}
        </span>

        {/* Loading overlay */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </span>
        )}
      </>
    )

    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ 
              variant: internalState === "success" ? "success" : 
                       internalState === "error" ? "destructive" : 
                       variant, 
              size, 
              loading: isLoading,
              state: internalState,
              className 
            }),
            isClicked && "scale-95",
            "transition-transform duration-75"
          )}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          {React.cloneElement(children as React.ReactElement, {
            children: buttonContent
          })}
        </Slot>
      )
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant: internalState === "success" ? "success" : 
                     internalState === "error" ? "destructive" : 
                     variant, 
            size, 
            loading: isLoading,
            state: internalState,
            className 
          }),
          isClicked && "scale-95",
          "transition-transform duration-75"
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

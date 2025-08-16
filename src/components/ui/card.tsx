import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col rounded-xl border transition-all duration-300 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl hover:-translate-y-1",
        glass: "bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:bg-white/20 hover:border-white/30 hover:shadow-3xl",
        gradient: "bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl hover:scale-[1.02]",
        elevated: "bg-card shadow-2xl border-0 hover:shadow-3xl hover:-translate-y-2",
        outlined: "bg-transparent border-2 border-border shadow-none hover:bg-card/50 hover:shadow-lg",
        floating: "bg-card/90 backdrop-blur-lg border-border/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.01]",
      },
      size: {
        sm: "p-4 gap-3",
        default: "p-6 gap-6",
        lg: "p-8 gap-8",
      },
      interactive: {
        true: "cursor-pointer hover-lift active:scale-[0.98]",
        false: "",
      },
      glow: {
        true: "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      glow: false,
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ 
  className, 
  variant, 
  size, 
  interactive, 
  glow,
  children,
  onClick,
  ...props 
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size, interactive, glow }), className)}
      onClick={onClick}
      {...props}
    >
      {/* Background Pattern */}
      {variant === "glass" && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
      
      {/* Shimmer effect */}
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000 ease-out pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

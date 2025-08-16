import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        purple:
          "border-transparent bg-purple-500 text-white [a&]:hover:bg-purple-600",
        pink:
          "border-transparent bg-pink-500 text-white [a&]:hover:bg-pink-600",
        gradient:
          "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white [a&]:hover:from-purple-600 [a&]:hover:to-pink-600",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Badge com status
interface StatusBadgeProps extends Omit<React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>, 'variant'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'idle';
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusConfig = {
    online: { variant: 'success' as const, text: 'Online' },
    offline: { variant: 'secondary' as const, text: 'Offline' },
    busy: { variant: 'destructive' as const, text: 'Ocupado' },
    away: { variant: 'warning' as const, text: 'Ausente' },
    idle: { variant: 'info' as const, text: 'Inativo' }
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn('gap-1', className)}
      {...props}
    >
      <div className={cn(
        'w-2 h-2 rounded-full',
        status === 'online' && 'bg-green-400 animate-pulse',
        status === 'offline' && 'bg-gray-400',
        status === 'busy' && 'bg-red-400',
        status === 'away' && 'bg-yellow-400',
        status === 'idle' && 'bg-blue-400'
      )} />
      {config.text}
    </Badge>
  );
}

// Badge com contador
interface CountBadgeProps extends Omit<React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export function CountBadge({ 
  count, 
  max = 99, 
  showZero = false, 
  className, 
  ...props 
}: CountBadgeProps) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant="destructive"
      size="sm"
      className={cn('min-w-[1.25rem] h-5 px-1 justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  );
}

export { Badge, badgeVariants }

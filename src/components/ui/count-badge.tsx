import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './badge'

interface CountBadgeProps {
  count: number | string
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  animated?: boolean
}

export function CountBadge({ 
  count, 
  label, 
  variant = 'default', 
  className,
  animated = false 
}: CountBadgeProps) {
  return (
    <div className={cn('flex flex-col items-center space-y-1', className)}>
      <Badge 
        variant={variant}
        className={cn(
          'text-lg font-bold px-3 py-1',
          animated && 'transition-all duration-300 hover:scale-105',
          className
        )}
      >
        {count}
      </Badge>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </div>
  )
}
import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingPulseProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'blue' | 'green' | 'purple' | 'gray'
}

export function LoadingPulse({ 
  size = 'md', 
  className,
  color = 'blue' 
}: LoadingPulseProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div 
        className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          animationDelay: '0ms',
          animationDuration: '1.4s'
        }}
      />
      <div 
        className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          animationDelay: '160ms',
          animationDuration: '1.4s'
        }}
      />
      <div 
        className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          animationDelay: '320ms',
          animationDuration: '1.4s'
        }}
      />
    </div>
  )
}
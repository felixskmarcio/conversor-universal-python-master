import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './badge'

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'maintenance'
  text: string
  className?: string
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const statusColors = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-red-100 text-red-800 border-red-200',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  const statusDots = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'flex items-center space-x-1.5 px-2 py-1',
        statusColors[status],
        className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full', statusDots[status])} />
      <span>{text}</span>
    </Badge>
  )
}
'use client'

import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Shield, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusBadgesProps {
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function StatusBadges({ variant = 'desktop', className }: StatusBadgesProps) {
  const badges = [
    {
      type: 'status' as const,
      status: 'online' as const,
      text: 'Sistema Online',
      className: 'text-xs'
    },
    {
      type: 'badge' as const,
      variant: 'secondary' as const,
      icon: Shield,
      text: 'Seguro',
      className: 'text-xs px-2 py-1'
    }
  ]

  const mobileBadges = [
    ...badges,
    {
      type: 'badge' as const,
      variant: 'outline' as const,
      icon: Star,
      text: 'Gratuito',
      className: 'text-xs px-2 py-1'
    }
  ]

  const badgesToRender = variant === 'mobile' ? mobileBadges : badges

  if (variant === 'mobile') {
    return (
      <div className={cn(
        'flex flex-wrap gap-2 pt-2 border-t border-gray-200/50',
        className
      )}>
        {badgesToRender.map((badge, index) => {
          if (badge.type === 'status') {
            return (
              <StatusBadge
                key={`status-${index}`}
                status={badge.status}
                text={badge.text}
                className={badge.className}
              />
            )
          }

          const Icon = badge.icon
          return (
            <Badge
              key={`badge-${index}`}
              variant={badge.variant}
              className={badge.className}
            >
              <Icon className="h-3 w-3 mr-1" />
              {badge.text}
            </Badge>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center space-x-3',
      className
    )}>
      {badgesToRender.map((badge, index) => {
        if (badge.type === 'status') {
          return (
            <StatusBadge
              key={`status-${index}`}
              status={badge.status}
              text={badge.text}
              className={badge.className}
            />
          )
        }

        const Icon = badge.icon
        return (
          <Badge
            key={`badge-${index}`}
            variant={badge.variant}
            className={badge.className}
          >
            <Icon className="h-3 w-3 mr-1" />
            {badge.text}
          </Badge>
        )
      })}
    </div>
  )
}

export default StatusBadges
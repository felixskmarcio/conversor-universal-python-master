'use client'

import { cn } from '@/lib/utils'

// Dados das estatísticas centralizados
export const statsData = [
  {
    id: 'conversions',
    value: '1000+',
    label: 'Conversões',
    color: 'text-indigo-600'
  },
  {
    id: 'uptime',
    value: '99.9%',
    label: 'Uptime',
    color: 'text-purple-600'
  }
]

interface QuickStatsProps {
  className?: string
}

export function QuickStats({ className }: QuickStatsProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/50',
      className
    )}>
      {statsData.map((stat) => (
        <div 
          key={stat.id}
          className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          role="region"
          aria-label={`Estatística: ${stat.label}`}
        >
          <div className={cn(
            'text-lg font-bold',
            stat.color
          )}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats
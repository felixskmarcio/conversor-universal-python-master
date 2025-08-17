'use client'

import { Button } from '@/components/ui/button'
import { Github, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTAButtonsProps {
  variant?: 'desktop' | 'mobile'
  onStartClick?: () => void
  className?: string
}

export function CTAButtons({ 
  variant = 'desktop', 
  onStartClick,
  className 
}: CTAButtonsProps) {
  const handleStartClick = () => {
    const converterSection = document.querySelector('[data-section="converter"]')
    if (converterSection) {
      converterSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
    onStartClick?.()
  }

  const handleGitHubClick = () => {
    window.open('https://github.com/felixskmarcio/conversor-universal-python-master', '_blank')
  }

  if (variant === 'mobile') {
    return (
      <div className={cn(
        'flex flex-col sm:flex-row gap-3 pt-2',
        className
      )}>
        <Button 
          variant="outline" 
          className="w-full sm:flex-1 justify-center items-center"
          onClick={handleGitHubClick}
          aria-label="Ver projeto no GitHub"
        >
          <Github className="h-4 w-4 mr-2 flex-shrink-0 inline" />
          <span>Ver no GitHub</span>
        </Button>
        <Button 
          className="w-full sm:flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 justify-center items-center"
          onClick={handleStartClick}
          aria-label="Começar a usar o conversor agora"
        >
          <Zap className="h-4 w-4 mr-2 flex-shrink-0 inline" />
          <span>Começar Agora</span>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 lg:space-x-3',
      className
    )}>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-sm px-3 py-2 flex items-center"
        onClick={handleGitHubClick}
        aria-label="Ver projeto no GitHub"
      >
        <Github className="h-4 w-4 mr-2 flex-shrink-0 inline" />
        <span className="hidden lg:inline">GitHub</span>
      </Button>
      <Button 
        size="sm"
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm px-3 lg:px-4 py-2 flex items-center"
        onClick={handleStartClick}
        aria-label="Começar a usar o conversor"
      >
        <Zap className="h-4 w-4 mr-1 lg:mr-2 flex-shrink-0 inline" />
        <span className="hidden lg:inline">Começar</span>
        <span className="lg:hidden">Start</span>
      </Button>
    </div>
  )
}

export default CTAButtons
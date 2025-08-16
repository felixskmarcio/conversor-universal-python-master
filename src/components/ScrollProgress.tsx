'use client'

import React, { useEffect, useState } from 'react'
import { useScrollProgress } from '@/hooks/useParallax'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  showPercentage?: boolean
  position?: 'top' | 'bottom'
  color?: string
}

export function ScrollProgress({
  className,
  showPercentage = false,
  position = 'top',
  color = 'bg-gradient-to-r from-indigo-500 to-purple-600'
}: ScrollProgressProps) {
  const progress = useScrollProgress()

  return (
    <>
      {/* Barra de progresso */}
      <div
        className={cn(
          'fixed left-0 right-0 z-50 h-1',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
      >
        <div className="h-full bg-gray-200/20 backdrop-blur-sm">
          <div
            className={cn('h-full transition-all duration-300 ease-out', color)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Indicador de porcentagem (opcional) */}
      {showPercentage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-lg border border-gray-200/50">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </>
  )
}

interface ScrollToTopProps {
  className?: string
  threshold?: number
}

export function ScrollToTop({ className, threshold = 300 }: ScrollToTopProps) {
  const progress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const calculateVisibility = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const thresholdProgress = (threshold / totalHeight) * 100
      setIsVisible(progress > thresholdProgress)
    }

    calculateVisibility()
  }, [progress, threshold, isMounted])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-xl transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
      aria-label="Voltar ao topo"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}

interface ParallaxBackgroundProps {
  children: React.ReactNode
  imageUrl?: string
  gradient?: string
  opacity?: number
  speed?: number
  className?: string
}

export function ParallaxBackground({
  children,
  imageUrl,
  gradient = 'from-blue-50 via-indigo-50 to-purple-50',
  opacity = 0.8,
  speed = 0.5,
  className
}: ParallaxBackgroundProps) {
  const progress = useScrollProgress()
  const parallaxOffset = progress * speed

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          willChange: 'transform'
        }}
      >
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imageUrl})`,
              opacity
            }}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} style={{ opacity }} />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
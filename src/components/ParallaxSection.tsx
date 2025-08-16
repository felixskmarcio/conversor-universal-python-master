'use client'

import React, { ReactNode } from 'react'
import { useParallax, useIntersectionObserver } from '@/hooks/useParallax'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  offset?: number
  className?: string
  backgroundImage?: string
  overlay?: boolean
  overlayOpacity?: number
  enableAnimation?: boolean
}

export function ParallaxSection({
  children,
  speed = 0.5,
  direction = 'up',
  offset = 0,
  className,
  backgroundImage,
  overlay = false,
  overlayOpacity = 0.5,
  enableAnimation = true
}: ParallaxSectionProps) {
  const { ref: parallaxRef, transform } = useParallax({ speed, direction, offset })
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  })

  // Combinar refs
  const setRefs = (element: HTMLElement | null) => {
    if (parallaxRef) parallaxRef.current = element
    if (intersectionRef) intersectionRef.current = element
  }

  return (
    <section
      ref={setRefs}
      className={cn(
        'relative overflow-hidden',
        enableAnimation && 'transition-all duration-1000 ease-out',
        isIntersecting && enableAnimation && 'animate-in fade-in slide-in-from-bottom-8',
        className
      )}
    >
      {/* Background com Parallax */}
      {backgroundImage && (
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: enableAnimation ? transform : undefined,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            scale: '1.1' // Evita bordas brancas durante o parallax
          }}
        >
          {overlay && (
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </div>
      )}
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  offset?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function ParallaxElement({
  children,
  speed = 0.3,
  direction = 'up',
  offset = 0,
  className,
  as: Component = 'div'
}: ParallaxElementProps) {
  const { ref, transform, isInView } = useParallax({ speed, direction, offset })
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver()

  const setRefs = (element: HTMLElement | null) => {
    if (ref) ref.current = element
    if (intersectionRef) intersectionRef.current = element
  }

  return (
    <Component
      ref={setRefs}
      className={cn(
        'transition-all duration-700 ease-out',
        isIntersecting && 'animate-in fade-in slide-in-from-bottom-4',
        className
      )}
      style={{
        transform: isInView ? transform : undefined,
        willChange: 'transform'
      }}
    >
      {children}
    </Component>
  )
}

interface FloatingElementProps {
  children: ReactNode
  amplitude?: number
  frequency?: number
  delay?: number
  className?: string
}

export function FloatingElement({
  children,
  amplitude = 10,
  frequency = 2000,
  delay = 0,
  className
}: FloatingElementProps) {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        '--float-amplitude': `${amplitude}px`,
        '--float-frequency': `${frequency}ms`,
        animationDelay: `${delay}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = 'up',
  distance = 50,
  duration = 600,
  delay = 0,
  className
}: ScrollRevealProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -5% 0px'
  })

  const getTransform = () => {
    if (isIntersecting) return 'translate3d(0, 0, 0)'
    
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`
      case 'down': return `translate3d(0, -${distance}px, 0)`
      case 'left': return `translate3d(${distance}px, 0, 0)`
      case 'right': return `translate3d(-${distance}px, 0, 0)`
      default: return `translate3d(0, ${distance}px, 0)`
    }
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all ease-out', className)}
      style={{
        transform: getTransform(),
        opacity: isIntersecting ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}
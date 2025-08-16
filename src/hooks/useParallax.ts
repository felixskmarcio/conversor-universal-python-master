'use client'

import { useEffect, useState, useRef } from 'react'

interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down'
  offset?: number
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', offset = 0 } = options
  const [scrollY, setScrollY] = useState(0)
  const elementRef = useRef<HTMLElement>(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleResize = () => {
      if (elementRef.current) {
        setElementTop(elementRef.current.offsetTop)
        setClientHeight(window.innerHeight)
      }
    }

    handleScroll()
    handleResize()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isInView = scrollY + clientHeight >= elementTop && scrollY <= elementTop + clientHeight
  const relativePos = scrollY - elementTop + offset
  const parallaxOffset = relativePos * speed * (direction === 'up' ? -1 : 1)

  return {
    ref: elementRef,
    transform: `translateY(${parallaxOffset}px)`,
    isInView,
    scrollY,
    parallaxOffset
  }
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  return { ref: elementRef, isIntersecting, entry }
}
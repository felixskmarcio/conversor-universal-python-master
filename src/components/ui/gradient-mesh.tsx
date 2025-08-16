'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface GradientMeshProps {
  className?: string
  variant?: 'default' | 'vibrant' | 'subtle' | 'ocean' | 'sunset' | 'forest' | 'cosmic'
  animated?: boolean
  intensity?: 'low' | 'medium' | 'high'
  overlay?: boolean
  interactive?: boolean
}

const gradientVariants = {
  default: {
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
    opacity: 0.15
  },
  vibrant: {
    colors: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b', '#fb5607'],
    opacity: 0.2
  },
  subtle: {
    colors: ['#e3f2fd', '#f3e5f5', '#fff3e0', '#f1f8e9', '#fce4ec', '#e8f5e8'],
    opacity: 0.1
  },
  ocean: {
    colors: ['#667eea', '#00d4ff', '#4facfe', '#00f2fe', '#667eea', '#a8edea'],
    opacity: 0.15
  },
  sunset: {
    colors: ['#ff9a9e', '#fecfef', '#fecfef', '#fdf7f0', '#ffecd2', '#fcb69f'],
    opacity: 0.2
  },
  forest: {
    colors: ['#134e5e', '#71b280', '#667eea', '#a8e6cf', '#88d8b0', '#ffecd2'],
    opacity: 0.15
  },
  cosmic: {
    colors: ['#667eea', '#764ba2', '#8b5cf6', '#a855f7', '#c084fc', '#e879f9'],
    opacity: 0.18
  }
}

export function GradientMesh({
  className,
  variant = 'default',
  animated = true,
  intensity = 'medium',
  overlay = false,
  interactive = false
}: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const config = gradientVariants[variant]
  
  const intensityMultiplier = {
    low: 0.7,
    medium: 1,
    high: 1.4
  }[intensity]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationTime = 0
    const orbs: Array<{
      x: number
      y: number
      radius: number
      color: string
      speed: number
      direction: number
      originalX: number
      originalY: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const createOrbs = () => {
      orbs.length = 0
      const orbCount = Math.min(Math.floor(canvas.offsetWidth / 100), 8)
      
      for (let i = 0; i < orbCount; i++) {
        const x = Math.random() * canvas.offsetWidth
        const y = Math.random() * canvas.offsetHeight
        
        orbs.push({
          x,
          y,
          radius: 80 + Math.random() * 120,
          color: config.colors[i % config.colors.length],
          speed: 0.5 + Math.random() * 0.5,
          direction: Math.random() * Math.PI * 2,
          originalX: x,
          originalY: y
        })
      }
    }

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 }
    }

    const drawOrb = (orb: typeof orbs[0], time: number) => {
      if (animated) {
        orb.x = orb.originalX + Math.sin(time * orb.speed) * 30
        orb.y = orb.originalY + Math.cos(time * orb.speed) * 20
      }

      // Interactive mouse effect
      if (interactive && isHovered) {
        const dx = mousePosition.x - orb.x
        const dy = mousePosition.y - orb.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance * 0.3
          orb.x -= (dx / distance) * force * 30
          orb.y -= (dy / distance) * force * 30
        }
      }

      const rgb = hexToRgb(orb.color)
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius * intensityMultiplier
      )
      
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * intensityMultiplier})`)
      gradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity * 0.6 * intensityMultiplier})`)
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(orb.x, orb.y, orb.radius * intensityMultiplier, 0, Math.PI * 2)
      ctx.fill()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      // Apply blend modes for better color mixing
      ctx.globalCompositeOperation = 'multiply'
      
      animationTime += 0.01
      
      orbs.forEach(orb => drawOrb(orb, animationTime))
      
      ctx.globalCompositeOperation = 'source-over'
      
      if (animated) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    const handleResize = () => {
      resizeCanvas()
      createOrbs()
    }

    window.addEventListener('resize', handleResize)
    resizeCanvas()
    createOrbs()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [variant, animated, intensity, interactive, isHovered, mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden",
        interactive && "cursor-none",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ 
          filter: `blur(${intensity === 'high' ? '40px' : intensity === 'medium' ? '60px' : '80px'})`,
          transform: 'scale(1.1)' // Prevent edge artifacts from blur
        }}
      />
      
      {/* Overlay gradient */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none" />
      )}
      
      {/* Noise texture for added depth */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// Preset components for common use cases
export function GradientMeshHero({ className }: { className?: string }) {
  return (
    <GradientMesh
      className={className}
      variant="cosmic"
      animated
      intensity="high"
      overlay
    />
  )
}

export function GradientMeshCard({ className }: { className?: string }) {
  return (
    <GradientMesh
      className={className}
      variant="subtle"
      animated={false}
      intensity="low"
    />
  )
}

export function GradientMeshInteractive({ className }: { className?: string }) {
  return (
    <GradientMesh
      className={className}
      variant="vibrant"
      animated
      intensity="medium"
      interactive
      overlay
    />
  )
}
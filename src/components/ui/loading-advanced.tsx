'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { FileText, RefreshCw, Check, AlertCircle } from 'lucide-react'

export interface LoadingStates {
  upload: 'idle' | 'uploading' | 'complete' | 'error'
  processing: 'idle' | 'processing' | 'complete' | 'error'
  download: 'idle' | 'ready' | 'complete' | 'error'
}

export interface LoadingAdvancedProps {
  className?: string
  progress?: number
  states?: LoadingStates
  fileName?: string
  targetFormat?: string
  showSteps?: boolean
  compact?: boolean
}

const defaultStates: LoadingStates = {
  upload: 'idle',
  processing: 'idle',
  download: 'idle'
}

export function LoadingAdvanced({
  className,
  progress = 0,
  states = defaultStates,
  fileName,
  targetFormat,
  showSteps = true,
  compact = false
}: LoadingAdvancedProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [progress])

  const steps = [
    {
      key: 'upload',
      label: 'Upload',
      icon: FileText,
      description: 'Enviando arquivo...',
      state: states.upload
    },
    {
      key: 'processing',
      label: 'Processamento',
      icon: RefreshCw,
      description: `Convertendo para ${targetFormat?.toUpperCase() || 'formato'}...`,
      state: states.processing
    },
    {
      key: 'download',
      label: 'Download',
      icon: Check,
      description: 'Arquivo pronto!',
      state: states.download
    }
  ]

  const getStateIcon = (state: string, IconComponent: React.ComponentType<{ className?: string }>) => {
    switch (state) {
      case 'uploading':
      case 'processing':
        return <RefreshCw className="w-5 h-5 animate-spin text-primary" />
      case 'complete':
        return <Check className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'ready':
        return <IconComponent className="w-5 h-5 text-blue-500" />
      default:
        return <IconComponent className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'uploading':
      case 'processing':
        return 'border-primary bg-primary/10'
      case 'complete':
        return 'border-green-500 bg-green-50'
      case 'error':
        return 'border-red-500 bg-red-50'
      case 'ready':
        return 'border-blue-500 bg-blue-50'
      default:
        return 'border-muted bg-muted/20'
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 p-4 rounded-xl bg-muted/30 backdrop-blur-sm", className)}>
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-muted animate-spin">
            <div className="w-full h-full rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
        </div>
        
        {/* Progress info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-foreground truncate">
              {fileName || 'Processando...'}
            </p>
            <span className="text-xs text-muted-foreground">
              {Math.round(animatedProgress)}%
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 p-6 rounded-xl bg-gradient-to-br from-muted/20 to-muted/5 backdrop-blur-sm border border-border/50", className)}>
      {/* File info */}
      {fileName && (
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground">{fileName}</h3>
          {targetFormat && (
            <p className="text-sm text-muted-foreground">
              Convertendo para {targetFormat.toUpperCase()}
            </p>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Progresso</span>
          <span className="text-sm text-muted-foreground">{Math.round(animatedProgress)}%</span>
        </div>
        
        <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/60" />
          
          {/* Progress fill */}
          <div 
            className="relative h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
          
          {/* Progress indicator */}
          {animatedProgress > 5 && (
            <div 
              className="absolute top-0 h-full w-1 bg-white/80 rounded-full shadow-sm transition-all duration-700 ease-out"
              style={{ left: `${Math.max(0, animatedProgress - 2)}%` }}
            />
          )}
        </div>
      </div>

      {/* Steps */}
      {showSteps && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const isActive = step.state !== 'idle'
            const isCompleted = step.state === 'complete'
            const isError = step.state === 'error'
            
            return (
              <div
                key={step.key}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all duration-300",
                  getStateColor(step.state),
                  isActive && "scale-105 shadow-lg",
                  "animate-in slide-in-from-bottom-4"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background animation */}
                <div className={cn(
                  "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300",
                  isActive && "opacity-100",
                  step.state === 'processing' && "bg-gradient-to-br from-primary/5 to-transparent animate-pulse",
                  step.state === 'uploading' && "bg-gradient-to-br from-blue-500/5 to-transparent animate-pulse"
                )} />
                
                {/* Content */}
                <div className="relative space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                      isCompleted && "bg-green-100 scale-110",
                      isError && "bg-red-100",
                      step.state === 'processing' && "animate-pulse"
                    )}>
                      {getStateIcon(step.state, step.icon)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">{step.label}</h4>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      step.state === 'idle' && "bg-muted",
                      step.state === 'uploading' && "bg-blue-500 animate-pulse",
                      step.state === 'processing' && "bg-primary animate-pulse",
                      step.state === 'complete' && "bg-green-500",
                      step.state === 'ready' && "bg-blue-500",
                      step.state === 'error' && "bg-red-500"
                    )} />
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                  
                  {/* Mini progress for active step */}
                  {(step.state === 'uploading' || step.state === 'processing') && (
                    <div className="w-full bg-muted/50 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-current opacity-60 animate-pulse" />
                    </div>
                  )}
                </div>
                
                {/* Completion checkmark animation */}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {/* Pulse animation for active processing */}
      {(states.processing === 'processing' || states.upload === 'uploading') && (
        <div className="flex justify-center">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
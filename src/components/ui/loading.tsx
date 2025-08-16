import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <div className={cn('flex space-x-2', className)}>
      <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-current rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-3 h-3 bg-current rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}

interface LoadingBarProps {
  progress?: number;
  className?: string;
  showPercentage?: boolean;
}

export function LoadingBar({ progress = 0, className, showPercentage = false }: LoadingBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">Progresso</span>
        {showPercentage && (
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-muted rounded shimmer',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        ></div>
      ))}
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title = 'Carregando...', description, className }: LoadingCardProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 space-y-4', className)}>
      <LoadingSpinner size="lg" className="text-primary" />
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  title = 'Processando...', 
  description,
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-background/80 backdrop-blur-sm',
      'animate-fade-in',
      className
    )}>
      <div className="bg-card border rounded-lg shadow-lg p-8 max-w-sm w-full mx-4 animate-scale-in">
        <LoadingCard title={title} description={description} />
      </div>
    </div>
  );
}

// Hook para gerenciar estados de loading
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [progress, setProgress] = React.useState(0);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    setProgress(0);
  }, []);

  const updateProgress = React.useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    setIsLoading,
    setProgress
  };
}

export default {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  LoadingBar,
  LoadingSkeleton,
  LoadingCard,
  LoadingOverlay,
  useLoading
};
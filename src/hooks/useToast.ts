'use client'

import { useState, useCallback } from 'react'

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const toast = useCallback({
    success: (message: string, title?: string) => 
      addToast({ 
        variant: 'success', 
        description: message, 
        title: title || 'Sucesso' 
      }),
    
    error: (message: string, title?: string) => 
      addToast({ 
        variant: 'destructive', 
        description: message, 
        title: title || 'Erro' 
      }),
    
    warning: (message: string, title?: string) => 
      addToast({ 
        variant: 'warning', 
        description: message, 
        title: title || 'Atenção' 
      }),
    
    info: (message: string, title?: string) => 
      addToast({ 
        variant: 'info', 
        description: message, 
        title: title || 'Informação' 
      }),
    
    default: (message: string, title?: string) => 
      addToast({ 
        variant: 'default', 
        description: message, 
        title 
      }),
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
  }
}
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast'
import { useToast, ToastMessage } from '@/hooks/useToast'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
  toast: {
    success: (message: string, title?: string) => string
    error: (message: string, title?: string) => string
    warning: (message: string, title?: string) => string
    info: (message: string, title?: string) => string
    default: (message: string, title?: string) => string
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, addToast, removeToast, removeAllToasts, toast } = useToast()

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'destructive':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts, toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
        {toasts.map((toastMessage) => (
          <Toast
            key={toastMessage.id}
            variant={toastMessage.variant}
            onClose={() => removeToast(toastMessage.id)}
            className="animate-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(toastMessage.variant)}
              </div>
              <div className="flex-1 min-w-0">
                {toastMessage.title && (
                  <ToastTitle className="font-semibold">
                    {toastMessage.title}
                  </ToastTitle>
                )}
                {toastMessage.description && (
                  <ToastDescription className="mt-1">
                    {toastMessage.description}
                  </ToastDescription>
                )}
              </div>
            </div>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
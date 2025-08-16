'use client'

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'
import { Alert, AlertDescription } from './alert'
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

// Form Context
interface FormContextType {
  values: Record<string, string | number | boolean>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  setValue: (name: string, value: string | number | boolean) => void
  setError: (name: string, error: string) => void
  setTouched: (name: string) => void
  validateField: (name: string) => boolean
}

const FormContext = createContext<FormContextType | null>(null)

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form')
  }
  return context
}

// Validation rules
export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string | number | boolean) => string | null
}

export interface FormProps {
  onSubmit: (values: Record<string, string | number | boolean>) => Promise<void> | void
  validation?: Record<string, ValidationRule>
  initialValues?: Record<string, string | number | boolean>
  className?: string
  children: React.ReactNode
}

export function Form({ 
  onSubmit, 
  validation = {}, 
  initialValues = {}, 
  className, 
  children 
}: FormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = (name: string, value: string | number | boolean) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const setError = (name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const setTouched = (name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
  }

  const validateField = (name: string): boolean => {
    const rule = validation[name]
    if (!rule) return true

    const value = values[name]
    let error = ''

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = 'Este campo é obrigatório'
    } else if (value && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        error = `Mínimo de ${rule.minLength} caracteres`
      } else if (rule.maxLength && value.length > rule.maxLength) {
        error = `Máximo de ${rule.maxLength} caracteres`
      } else if (rule.pattern && !rule.pattern.test(value)) {
        error = 'Formato inválido'
      }
    }

    if (!error && rule.custom) {
      error = rule.custom(value) || ''
    }

    if (error) {
      setError(name, error)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    let hasErrors = false
    Object.keys(validation).forEach(name => {
      setTouched(name)
      if (!validateField(name)) {
        hasErrors = true
      }
    })

    if (!hasErrors) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }

    setIsSubmitting(false)
  }

  const contextValue: FormContextType = {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    setTouched,
    validateField
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// Enhanced Form Field
export interface FormFieldProps {
  name: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  disabled?: boolean
  className?: string
  description?: string
  required?: boolean
}

export function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  className,
  description,
  required = false
}: FormFieldProps) {
  const { values, errors, touched, setValue, setTouched, validateField } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)

  const value = values[name] || ''
  const error = errors[name]
  const isTouched = touched[name]
  const hasError = error && isTouched

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value)
  }

  const handleBlur = () => {
    setTouched(name)
    validateField(name)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'transition-all duration-200',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            !hasError && isTouched && value && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
            type === 'password' && 'pr-12'
          )}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {/* Validation icon */}
        {isTouched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : value ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Description */}
      {description && !hasError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {/* Error message */}
      {hasError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}

// Form Submit Button
export interface FormSubmitProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  className?: string
  loadingText?: string
}

export function FormSubmit({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className,
  loadingText = 'Enviando...' 
}: FormSubmitProps) {
  const { isSubmitting } = useFormContext()

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      loading={isSubmitting}
      loadingText={loadingText}
    >
      {children}
    </Button>
  )
}

// Form Error Display
export interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

// Form Success Display
export interface FormSuccessProps {
  message?: string
  className?: string
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null

  return (
    <Alert className={cn('border-green-500 bg-green-50', className)}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-700">{message}</AlertDescription>
    </Alert>
  )
}
/**
 * Client-side validation utilities with strong typing
 */

import { DocumentFormat, FileValidationResult, RiskLevel } from '@/types/converter'

// Validation error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// File validation utilities
export class FileValidator {
  private static readonly MAX_FILE_SIZE = 16 * 1024 * 1024 // 16MB
  private static readonly ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt', '.html', '.htm', '.md', '.markdown']
  private static readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/html',
    'text/markdown',
    'text/x-markdown'
  ]

  static validateFile(file: File): FileValidationResult {
    const errors: string[] = []

    // Check if file exists
    if (!file) {
      return {
        isValid: false,
        message: 'No file provided',
        riskLevel: RiskLevel.HIGH
      }
    }

    // Validate filename
    const filenameResult = this.validateFilename(file.name)
    if (!filenameResult.isValid) {
      return filenameResult
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        message: `File too large. Maximum size is ${this.formatFileSize(this.MAX_FILE_SIZE)}`,
        riskLevel: RiskLevel.MEDIUM,
        details: {
          actualSize: file.size,
          maxSize: this.MAX_FILE_SIZE
        }
      }
    }

    // Validate file extension
    const extension = this.getFileExtension(file.name)
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        message: `File type not supported. Allowed types: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
        riskLevel: RiskLevel.MEDIUM,
        details: {
          extension,
          allowedExtensions: this.ALLOWED_EXTENSIONS
        }
      }
    }

    // Validate MIME type
    if (file.type && !this.ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        message: `Invalid file type detected`,
        riskLevel: RiskLevel.HIGH,
        details: {
          mimeType: file.type,
          allowedMimeTypes: this.ALLOWED_MIME_TYPES
        }
      }
    }

    return {
      isValid: true,
      message: 'File validation passed',
      riskLevel: RiskLevel.LOW
    }
  }

  static validateFilename(filename: string): FileValidationResult {
    if (!filename || filename.trim().length === 0) {
      return {
        isValid: false,
        message: 'Filename cannot be empty',
        riskLevel: RiskLevel.HIGH
      }
    }

    // Check for dangerous characters
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/
    if (dangerousChars.test(filename)) {
      return {
        isValid: false,
        message: 'Filename contains invalid characters',
        riskLevel: RiskLevel.HIGH,
        details: {
          filename,
          dangerousChars: filename.match(dangerousChars) || []
        }
      }
    }

    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return {
        isValid: false,
        message: 'Path traversal attempt detected in filename',
        riskLevel: RiskLevel.CRITICAL,
        details: { filename }
      }
    }

    // Check filename length
    if (filename.length > 255) {
      return {
        isValid: false,
        message: 'Filename too long (maximum 255 characters)',
        riskLevel: RiskLevel.MEDIUM,
        details: {
          length: filename.length,
          maxLength: 255
        }
      }
    }

    return {
      isValid: true,
      message: 'Filename validation passed',
      riskLevel: RiskLevel.LOW
    }
  }

  static validateFormat(format: string): DocumentFormat | null {
    const normalizedFormat = format.toLowerCase().trim()
    
    if (Object.values(DocumentFormat).includes(normalizedFormat as DocumentFormat)) {
      return normalizedFormat as DocumentFormat
    }
    
    return null
  }

  private static getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.')
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex).toLowerCase() : ''
  }

  private static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}

// Form validation utilities
export class FormValidator {
  static validateRequired<T>(value: T, fieldName: string): T {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED')
    }
    return value
  }

  static validateString(value: unknown, fieldName: string, options?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  }): string {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE')
    }

    if (options?.minLength && value.length < options.minLength) {
      throw new ValidationError(
        `${fieldName} must be at least ${options.minLength} characters`,
        fieldName,
        'MIN_LENGTH'
      )
    }

    if (options?.maxLength && value.length > options.maxLength) {
      throw new ValidationError(
        `${fieldName} must be at most ${options.maxLength} characters`,
        fieldName,
        'MAX_LENGTH'
      )
    }

    if (options?.pattern && !options.pattern.test(value)) {
      throw new ValidationError(
        `${fieldName} format is invalid`,
        fieldName,
        'INVALID_FORMAT'
      )
    }

    return value
  }

  static validateNumber(value: unknown, fieldName: string, options?: {
    min?: number
    max?: number
    integer?: boolean
  }): number {
    const num = Number(value)
    
    if (isNaN(num)) {
      throw new ValidationError(`${fieldName} must be a number`, fieldName, 'INVALID_TYPE')
    }

    if (options?.integer && !Number.isInteger(num)) {
      throw new ValidationError(`${fieldName} must be an integer`, fieldName, 'NOT_INTEGER')
    }

    if (options?.min !== undefined && num < options.min) {
      throw new ValidationError(
        `${fieldName} must be at least ${options.min}`,
        fieldName,
        'MIN_VALUE'
      )
    }

    if (options?.max !== undefined && num > options.max) {
      throw new ValidationError(
        `${fieldName} must be at most ${options.max}`,
        fieldName,
        'MAX_VALUE'
      )
    }

    return num
  }

  static validateEnum<T extends Record<string, string>>(
    value: unknown,
    enumObject: T,
    fieldName: string
  ): T[keyof T] {
    const enumValues = Object.values(enumObject)
    
    if (!enumValues.includes(value as T[keyof T])) {
      throw new ValidationError(
        `${fieldName} must be one of: ${enumValues.join(', ')}`,
        fieldName,
        'INVALID_ENUM'
      )
    }

    return value as T[keyof T]
  }
}

// Sanitization utilities
export class Sanitizer {
  static sanitizeFilename(filename: string): string {
    // Remove dangerous characters
    let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    
    // Remove path traversal attempts
    sanitized = sanitized.replace(/\.\./g, '_')
    
    // Limit length
    if (sanitized.length > 255) {
      const extension = sanitized.substring(sanitized.lastIndexOf('.'))
      const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'))
      sanitized = nameWithoutExt.substring(0, 255 - extension.length) + extension
    }
    
    // Ensure it's not empty
    if (!sanitized.trim()) {
      sanitized = 'document.txt'
    }
    
    return sanitized
  }

  static sanitizeString(input: string, maxLength: number = 1000): string {
    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    
    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }
    
    return sanitized.trim()
  }
}
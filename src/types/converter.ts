/**
 * Type definitions for the document converter application
 * Following TypeScript best practices with strict typing
 */

// Enums for better type safety
export enum DocumentFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  TXT = 'txt',
  HTML = 'html',
  MARKDOWN = 'md'
}

export enum ConversionStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETE = 'complete',
  ERROR = 'error',
  READY = 'ready'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Base interfaces
export interface BaseResponse {
  success: boolean
  message: string
  timestamp?: string
}

export interface ErrorDetails {
  code?: string
  field?: string
  value?: unknown
  constraints?: string[]
}

// File-related types
export interface FileWithPreview extends File {
  preview?: string
  id?: string
}

export interface FileValidationResult {
  isValid: boolean
  message: string
  riskLevel: RiskLevel
  details?: Record<string, unknown>
}

export interface DocumentMetadata {
  title?: string
  author?: string
  format?: DocumentFormat
  pageCount?: number
  wordCount?: number
  structureElements?: string[]
  createdAt?: string
  modifiedAt?: string
}

// Conversion-related types
export interface ConversionRequest {
  file: File
  targetFormat: DocumentFormat
  options?: ConversionOptions
}

export interface ConversionOptions {
  preserveFormatting?: boolean
  extractImages?: boolean
  ocrEnabled?: boolean
  quality?: number
  pageSize?: 'A4' | 'letter' | 'legal'
  margin?: number
}

export interface ConversionResult extends BaseResponse {
  downloadUrl?: string
  filename?: string
  metadata?: DocumentMetadata
  processingTime?: number
}

export interface ConversionResponse extends BaseResponse {
  data?: {
    filename: string
    downloadUrl: string
    metadata: DocumentMetadata
  }
  error?: {
    code: string
    details: ErrorDetails[]
  }
}

// Loading states
export interface LoadingStates {
  upload: ConversionStatus
  processing: ConversionStatus
  download: ConversionStatus
}

export interface ConversionProgress {
  stage: 'upload' | 'processing' | 'download'
  percentage: number
  message?: string
  estimatedTimeRemaining?: number
}

// API-related types
export interface ApiEndpoints {
  health: string
  formats: string
  convert: string
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  maxRetries: number
  endpoints: ApiEndpoints
}

export interface ApiError extends Error {
  status?: number
  code?: string
  details?: ErrorDetails[]
}

// Component prop types
export interface DocumentConverterProps {
  className?: string
  maxFileSize?: number
  supportedFormats?: DocumentFormat[]
  onConversionStart?: (request: ConversionRequest) => void
  onConversionComplete?: (result: ConversionResult) => void
  onConversionError?: (error: ApiError) => void
}

export interface FormatSelectorProps {
  selectedFormat: DocumentFormat
  onFormatChange: (format: DocumentFormat) => void
  availableFormats?: DocumentFormat[]
  disabled?: boolean
  className?: string
}

export interface FileUploadProps {
  onFilesSelected: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  showPreview?: boolean
  supportedFormats?: string[]
  className?: string
  disabled?: boolean
}

export interface ConversionResultProps {
  result: ConversionResult
  onDownload?: () => void
  onRetry?: () => void
  className?: string
}

// Utility types
export type FileFormat = keyof typeof DocumentFormat
export type ConversionStatusType = keyof typeof ConversionStatus

// Type guards
export const isDocumentFormat = (value: string): value is DocumentFormat => {
  return Object.values(DocumentFormat).includes(value as DocumentFormat)
}

export const isConversionStatus = (value: string): value is ConversionStatus => {
  return Object.values(ConversionStatus).includes(value as ConversionStatus)
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && 'status' in error
}

// Constants
export const SUPPORTED_FORMATS = Object.values(DocumentFormat)
export const MAX_FILE_SIZE = 16 * 1024 * 1024 // 16MB
export const CONVERSION_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export const FORMAT_EXTENSIONS: Record<DocumentFormat, string[]> = {
  [DocumentFormat.PDF]: ['.pdf'],
  [DocumentFormat.DOCX]: ['.docx', '.doc'],
  [DocumentFormat.TXT]: ['.txt'],
  [DocumentFormat.HTML]: ['.html', '.htm'],
  [DocumentFormat.MARKDOWN]: ['.md', '.markdown']
}

export const FORMAT_MIME_TYPES: Record<DocumentFormat, string[]> = {
  [DocumentFormat.PDF]: ['application/pdf'],
  [DocumentFormat.DOCX]: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ],
  [DocumentFormat.TXT]: ['text/plain'],
  [DocumentFormat.HTML]: ['text/html'],
  [DocumentFormat.MARKDOWN]: ['text/markdown', 'text/x-markdown']
}
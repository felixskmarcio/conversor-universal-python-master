'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Progress } from './progress'
import {
  Upload,
  FileText,
  FileImage,
  FileCode,
  File,
  X,
  Check,
  AlertCircle,
  FileType,
  Eye,
  Trash2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileWithPreview extends File {
  preview?: string
  id: string
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export interface FileUploadProps {
  onFilesSelected: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: Record<string, string[]>
  className?: string
  multiple?: boolean
  showPreview?: boolean
  supportedFormats?: string[]
}

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  txt: FileType,
  html: FileCode,
  htm: FileCode,
  md: FileImage,
  markdown: FileImage,
  default: File
}

const formatColors: Record<string, string> = {
  pdf: 'bg-red-100 text-red-800 border-red-200',
  docx: 'bg-blue-100 text-blue-800 border-blue-200',
  doc: 'bg-blue-100 text-blue-800 border-blue-200',
  txt: 'bg-gray-100 text-gray-800 border-gray-200',
  html: 'bg-orange-100 text-orange-800 border-orange-200',
  htm: 'bg-orange-100 text-orange-800 border-orange-200',
  md: 'bg-purple-100 text-purple-800 border-purple-200',
  markdown: 'bg-purple-100 text-purple-800 border-purple-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 1,
  maxSize = 16 * 1024 * 1024,
  acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'text/plain': ['.txt'],
    'text/html': ['.html', '.htm'],
    'text/markdown': ['.md', '.markdown']
  },
  className,
  multiple = false,
  showPreview = true,
  supportedFormats = ['PDF', 'DOCX', 'TXT', 'HTML', 'Markdown']
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { file: File; errors: { code: string; message: string }[] }[]) => {
    const newFiles: FileWithPreview[] = acceptedFiles.map((file, index) => ({
      ...file,
      id: `${file.name}-${Date.now()}-${index}`,
      preview: showPreview && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'idle' as const,
      progress: 0
    }))

    setFiles(prevFiles => {
      const updatedFiles = multiple ? [...prevFiles, ...newFiles] : newFiles
      onFilesSelected(updatedFiles)
      return updatedFiles
    })

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      console.warn('Some files were rejected:', rejectedFiles)
    }
  }, [multiple, showPreview, onFilesSelected])

  const { getRootProps, getInputProps, isDragOver } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: multiple && maxFiles > 1,
    maxSize,
    maxFiles,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  })

  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(f => f.id !== fileId)
      onFilesSelected(updatedFiles)
      return updatedFiles
    })
  }, [onFilesSelected])

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || 'default'
    const IconComponent = formatIcons[extension] || formatIcons.default
    return IconComponent
  }

  const getFileColor = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || 'default'
    return formatColors[extension] || formatColors.default
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out",
        "border-2 border-dashed cursor-pointer group",
        isDragActive || isDragOver
          ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20",
        "backdrop-blur-sm bg-gradient-to-br from-background/80 to-muted/30"
      )}>
        <div {...getRootProps()} className="relative">
          <input {...getInputProps()} ref={fileInputRef} />
          <CardContent className="p-8 text-center space-y-4">
            {/* Animated upload icon */}
            <div className={cn(
              "mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30",
              isDragActive && "scale-110 animate-pulse"
            )}>
              <Upload className={cn(
                "w-10 h-10 transition-all duration-300",
                isDragActive ? "text-primary animate-bounce" : "text-muted-foreground group-hover:text-primary"
              )} />
            </div>

            {/* Upload text */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {isDragActive ? "Solte o arquivo aqui" : "Faça upload do seu documento"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Arraste e solte ou <span className="text-primary font-medium">clique para selecionar</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Máximo {formatFileSize(maxSize)} • {multiple ? `Até ${maxFiles} arquivos` : 'Um arquivo por vez'}
              </p>
            </div>

            {/* Supported formats */}
            <div className="pt-2">
              <div className="flex flex-wrap justify-center gap-1">
                {supportedFormats.map((format, index) => (
                  <Badge 
                    key={format}
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted animate-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Gradient overlay animation */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500",
            isDragActive && "opacity-100"
          )} />
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Arquivos selecionados ({files.length})
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {files.map((file, index) => {
              const IconComponent = getFileIcon(file.name)
              const colorClasses = getFileColor(file.name)
              
              return (
                <Card 
                  key={file.id}
                  className={cn(
                    "group hover-lift transition-all duration-200",
                    "animate-in slide-in-from-bottom-4",
                    file.status === 'success' && "border-green-200 bg-green-50/50",
                    file.status === 'error' && "border-destructive bg-destructive/5"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* File info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "p-2 rounded-lg border flex-shrink-0",
                          colorClasses
                        )}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span className="capitalize">
                              {file.name.split('.').pop()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status and actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.status === 'uploading' && (
                          <div className="flex items-center gap-2">
                            <Progress value={file.progress} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {file.progress}%
                            </span>
                          </div>
                        )}
                        
                        {file.status === 'success' && (
                          <div className="p-1 bg-green-100 text-green-600 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <div className="p-1 bg-destructive/10 text-destructive rounded-full">
                            <AlertCircle className="w-3 h-3" />
                          </div>
                        )}

                        {/* Preview button for images */}
                        {file.preview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              // Open preview modal
                              console.log('Preview file:', file.name)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress bar for uploading files */}
                    {file.status === 'uploading' && (
                      <div className="mt-3">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}

                    {/* Error message */}
                    {file.status === 'error' && file.error && (
                      <div className="mt-2 text-xs text-destructive bg-destructive/5 rounded px-2 py-1">
                        {file.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Add more files button */}
          {multiple && files.length < maxFiles && (
            <Button
              variant="outline"
              className="w-full h-10 border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar mais arquivos ({files.length}/{maxFiles})
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
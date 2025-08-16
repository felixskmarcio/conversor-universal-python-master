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

export function FileUploadFixed({
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
    console.log('FileUploadFixed - onDrop chamado:', { acceptedFiles, rejectedFiles })
    
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

  const { getRootProps, getInputProps, isDragOver, open } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: multiple && maxFiles > 1,
    maxSize,
    maxFiles,
    onDragEnter: () => {
      console.log('FileUploadFixed - onDragEnter')
      setIsDragActive(true)
    },
    onDragLeave: () => {
      console.log('FileUploadFixed - onDragLeave')
      setIsDragActive(false)
    },
    onDropAccepted: () => {
      console.log('FileUploadFixed - onDropAccepted')
      setIsDragActive(false)
    },
    onDropRejected: () => {
      console.log('FileUploadFixed - onDropRejected')
      setIsDragActive(false)
    },
    noClick: false,
    noKeyboard: false
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

  const handleManualClick = useCallback(() => {
    console.log('FileUploadFixed - Botão manual clicado')
    open()
  }, [open])

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

  console.log('FileUploadFixed - Render:', { isDragActive, isDragOver, filesCount: files.length })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area - Versão Simplificada */}
      <div className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive || isDragOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      )}>
        <div {...getRootProps()}>
          <input {...getInputProps()} ref={fileInputRef} />
          
          {/* Upload icon */}
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
            <Upload className={cn(
              "w-8 h-8",
              isDragActive ? "text-blue-500" : "text-gray-500"
            )} />
          </div>

          {/* Upload text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {isDragActive ? "Solte o arquivo aqui" : "Faça upload do seu documento"}
            </h3>
            <p className="text-sm text-gray-600">
              Arraste e solte ou <span className="text-blue-500 font-medium">clique para selecionar</span>
            </p>
            <p className="text-xs text-gray-500">
              Máximo {formatFileSize(maxSize)} • {multiple ? `Até ${maxFiles} arquivos` : 'Um arquivo por vez'}
            </p>
          </div>

          {/* Supported formats */}
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-2">
              {supportedFormats.map((format) => (
                <Badge 
                  key={format}
                  variant="secondary" 
                  className="text-xs px-2 py-1"
                >
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botão manual para teste */}
      <div className="text-center">
        <Button 
          onClick={handleManualClick}
          variant="outline"
          className="mx-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Abrir Seletor de Arquivos
        </Button>
      </div>

      {/* Debug info */}
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        <p>Debug: isDragActive={String(isDragActive)}, isDragOver={String(isDragOver)}, files={files.length}</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Arquivos selecionados ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((file, index) => {
              const IconComponent = getFileIcon(file.name)
              const colorClasses = getFileColor(file.name)
              
              return (
                <Card key={file.id} className="group hover:shadow-md transition-shadow">
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
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span className="capitalize">
                              {file.name.split('.').pop()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
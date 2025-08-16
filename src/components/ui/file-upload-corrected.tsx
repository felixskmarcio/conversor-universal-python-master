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

export function FileUploadCorrected({
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

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('FileUploadCorrected - onDrop:', { acceptedFiles, rejectedFiles })
    
    if (acceptedFiles.length === 0) {
      console.warn('Nenhum arquivo aceito')
      return
    }

    const newFiles: FileWithPreview[] = acceptedFiles.map((file, index) => ({
      ...file,
      id: `${file.name}-${Date.now()}-${index}`,
      preview: showPreview && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'idle' as const,
      progress: 0
    }))

    console.log('Novos arquivos criados:', newFiles)

    setFiles(prevFiles => {
      const updatedFiles = multiple ? [...prevFiles, ...newFiles] : newFiles
      console.log('Arquivos atualizados:', updatedFiles)
      onFilesSelected(updatedFiles)
      return updatedFiles
    })

    if (rejectedFiles.length > 0) {
      console.warn('Arquivos rejeitados:', rejectedFiles)
    }
  }, [multiple, showPreview, onFilesSelected])

  const { getRootProps, getInputProps, isDragOver } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: multiple && maxFiles > 1,
    maxSize,
    maxFiles,
    onDragEnter: () => {
      console.log('onDragEnter')
      setIsDragActive(true)
    },
    onDragLeave: () => {
      console.log('onDragLeave')
      setIsDragActive(false)
    },
    onDropAccepted: () => {
      console.log('onDropAccepted')
      setIsDragActive(false)
    },
    onDropRejected: () => {
      console.log('onDropRejected')
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    const IconComponent = formatIcons[extension] || formatIcons.default
    return IconComponent
  }

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    return formatColors[extension] || formatColors.default
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  console.log('FileUploadCorrected - Render:', { isDragActive, isDragOver, filesCount: files.length })

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="relative">
            <div
              {...getRootProps()}
              className={cn(
                'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
                isDragActive || isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              )}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={cn(
                  'p-3 rounded-full transition-colors',
                  isDragActive || isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                )}>
                  <Upload className={cn(
                    'h-8 w-8',
                    isDragActive || isDragOver ? 'text-blue-600' : 'text-gray-600'
                  )} />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive || isDragOver
                      ? 'Solte os arquivos aqui'
                      : 'Arraste arquivos aqui ou clique para selecionar'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Máximo {maxFiles} arquivo{maxFiles > 1 ? 's' : ''} • Até {formatFileSize(maxSize)}
                  </p>
                </div>
              </div>

              {/* Supported Formats */}
              {supportedFormats && supportedFormats.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-2">Formatos suportados:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {supportedFormats.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drag Overlay */}
            {(isDragActive || isDragOver) && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg pointer-events-none" />
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">
                Arquivos selecionados ({files.length})
              </h4>
              
              <div className="space-y-2">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.name)
                  const colorClass = getFileColor(file.name)
                  
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={cn('p-2 rounded border', colorClass)}>
                          <FileIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {file.status === 'uploading' && (
                            <div className="flex items-center space-x-2">
                              <Progress value={file.progress} className="w-16" />
                              <span className="text-xs text-gray-500">{file.progress}%</span>
                            </div>
                          )}
                          
                          {file.status === 'success' && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                          
                          {file.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          
                          {showPreview && file.preview && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.preview, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add More Files Button */}
          {multiple && files.length > 0 && files.length < maxFiles && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar mais arquivos
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
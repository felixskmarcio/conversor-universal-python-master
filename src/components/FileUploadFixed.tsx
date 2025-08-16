'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadFixedProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  supportedFormats?: string[]
  className?: string
  showPreview?: boolean
}

export function FileUploadFixed({
  onFilesSelected,
  maxFiles = 1,
  maxSize = 16 * 1024 * 1024, // 16MB
  supportedFormats = ['PDF', 'DOCX', 'TXT', 'HTML', 'Markdown'],
  className,
  showPreview = true
}: FileUploadFixedProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`Arquivo muito grande. Tamanho máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Formato de arquivo não suportado')
      } else {
        setError('Erro ao processar arquivo')
      }
      return
    }

    if (acceptedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivo(s) permitido(s)`)
      return
    }

    setSelectedFiles(acceptedFiles)
    onFilesSelected(acceptedFiles)
  }, [maxFiles, maxSize, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'text/markdown': ['.md']
    },
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDropAccepted: () => setIsDragOver(false),
    onDropRejected: () => setIsDragOver(false)
  })

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Área de Upload */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          'hover:border-primary/50 hover:bg-primary/5',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          isDragActive || isDragOver
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-border/50 bg-background/50',
          error && 'border-red-400 bg-red-50/50'
        )}
      >
        <input {...getInputProps()} />
        
        {/* Ícone e texto */}
        <div className="space-y-4">
          <div className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200',
            isDragActive || isDragOver
              ? 'bg-primary/20 text-primary scale-110'
              : 'bg-muted text-muted-foreground'
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              {isDragActive
                ? 'Solte os arquivos aqui'
                : 'Clique para selecionar ou arraste arquivos'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Formatos suportados: {supportedFormats.join(', ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Tamanho máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
        </div>
        
        {/* Botão manual */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
          className={cn(
            'mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg',
            'hover:bg-primary/90 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20'
          )}
        >
          Selecionar Arquivos
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Preview dos arquivos selecionados */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Arquivos Selecionados
          </h4>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                  title="Remover arquivo"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadFixed
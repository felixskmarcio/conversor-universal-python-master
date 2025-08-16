'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileUpload, FileWithPreview } from '@/components/ui/file-upload'
import { LoadingAdvanced } from '@/components/ui/loading-advanced'
import { FormatSelector } from '@/components/FormatSelector'
import { ConversionResult } from '@/components/ConversionResult'
import { useDocumentConverter, FileFormat } from '@/hooks/useDocumentConverter'
import { Upload, RefreshCw } from 'lucide-react'

interface DocumentConverterProps {
  className?: string
}

export function DocumentConverter({ className }: DocumentConverterProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [targetFormat, setTargetFormat] = useState<FileFormat>('pdf')
  
  const {
    isConverting,
    progress,
    result,
    loadingStates,
    convertDocument,
    downloadFile,
    resetState
  } = useDocumentConverter()

  const selectedFile = selectedFiles[0] || null

  const onFilesSelected = useCallback((files: FileWithPreview[]) => {
    setSelectedFiles(files)
    resetState()
    
    // Auto-select target format based on source
    if (files.length > 0) {
      const extension = files[0].name.split('.').pop()?.toLowerCase()
      const formatMap: Record<string, FileFormat> = {
        'pdf': 'docx',
        'docx': 'pdf',
        'doc': 'pdf',
        'txt': 'pdf',
        'html': 'pdf',
        'htm': 'pdf',
        'md': 'html',
        'markdown': 'html'
      }
      
      if (extension && formatMap[extension]) {
        setTargetFormat(formatMap[extension])
      }
    }
  }, [resetState])

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return
    await convertDocument(selectedFile, targetFormat)
  }, [selectedFile, targetFormat, convertDocument])

  const handleDownload = useCallback(() => {
    if (result) {
      downloadFile(result)
    }
  }, [result, downloadFile])

  return (
    <div className={className}>
      <Card 
        variant="glass" 
        size="lg"
        className="shadow-2xl border-white/20 bg-white/10 backdrop-blur-md hover-lift"
      >
        <CardHeader className="text-center pb-6 sm:pb-8">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold text-foreground">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Conversor Universal
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Faça upload do seu documento e converta para o formato desejado com nossa tecnologia avançada
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* File Upload Component */}
          <FileUpload
            onFilesSelected={onFilesSelected}
            maxFiles={1}
            maxSize={16 * 1024 * 1024}
            showPreview={false}
            supportedFormats={['PDF', 'DOCX', 'TXT', 'HTML', 'Markdown']}
            className="rounded-xl"
          />

          {/* Format Selection */}
          {selectedFiles.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-lg font-semibold text-foreground">
                  Converter para:
                </Label>
              </div>
              
              <FormatSelector
                selectedFormat={targetFormat}
                onFormatChange={setTargetFormat}
              />

              {/* Convert Button */}
              <div className="pt-4">
                <Button
                  onClick={handleConvert}
                  disabled={isConverting || !selectedFile}
                  variant="gradient"
                  size="xl"
                  className="w-full font-semibold text-lg"
                  loading={isConverting}
                  loadingText="Convertendo..."
                  leftIcon={!isConverting ? <RefreshCw className="w-5 h-5" /> : undefined}
                >
                  Converter Documento
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Loading States */}
          {isConverting && (
            <LoadingAdvanced
              progress={progress}
              states={loadingStates}
              fileName={selectedFile?.name}
              targetFormat={targetFormat}
              showSteps={true}
              className="bg-background/30 backdrop-blur-sm border-white/10"
            />
          )}

          {/* Result Display */}
          {result && (
            <ConversionResult
              result={result}
              onDownload={handleDownload}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
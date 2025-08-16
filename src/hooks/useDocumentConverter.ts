import { useState, useCallback } from 'react'
import { useToastContext } from '@/components/ToastProvider'

export type FileFormat = 'pdf' | 'docx' | 'txt' | 'html' | 'md'

export interface ConversionState {
  isConverting: boolean
  progress: number
  result: ConversionResult | null
  loadingStates: LoadingStates
}

export interface ConversionResult {
  success: boolean
  message: string
  downloadUrl?: string
  filename?: string
}

export interface LoadingStates {
  upload: 'idle' | 'uploading' | 'complete' | 'error'
  processing: 'idle' | 'processing' | 'complete' | 'error'
  download: 'idle' | 'ready' | 'complete'
}

export interface FileWithPreview extends File {
  preview?: string
}

export const useDocumentConverter = () => {
  const [state, setState] = useState<ConversionState>({
    isConverting: false,
    progress: 0,
    result: null,
    loadingStates: {
      upload: 'idle',
      processing: 'idle',
      download: 'idle'
    }
  })
  
  const { toast } = useToastContext()

  const updateState = useCallback((updates: Partial<ConversionState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateLoadingStates = useCallback((updates: Partial<LoadingStates>) => {
    setState(prev => ({
      ...prev,
      loadingStates: { ...prev.loadingStates, ...updates }
    }))
  }, [])

  const resetState = useCallback(() => {
    setState({
      isConverting: false,
      progress: 0,
      result: null,
      loadingStates: {
        upload: 'idle',
        processing: 'idle',
        download: 'idle'
      }
    })
  }, [])

  const simulateProgress = useCallback(async (start: number, end: number, duration: number) => {
    const steps = Math.ceil((end - start) / 5)
    const stepDuration = duration / steps
    
    for (let i = start; i <= end; i += 5) {
      updateState({ progress: Math.min(i, end) })
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }
  }, [updateState])

  const convertDocument = useCallback(async (
    file: FileWithPreview,
    targetFormat: FileFormat
  ): Promise<ConversionResult> => {
    if (!file) {
      const error = 'Por favor, selecione um arquivo para converter.'
      toast.warning(error)
      throw new Error(error)
    }

    try {
      updateState({ isConverting: true, progress: 0, result: null })
      updateLoadingStates({ upload: 'uploading', processing: 'idle', download: 'idle' })
      
      toast.info('Iniciando conversão...', 'Processando')

      // Phase 1: Upload simulation
      await simulateProgress(0, 30, 1000)
      updateLoadingStates({ upload: 'complete', processing: 'processing' })

      // Prepare form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('target_format', targetFormat)

      // Make API request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/v1/convert`, {
        method: 'POST',
        body: formData
      })

      // Phase 2: Processing simulation
      await simulateProgress(30, 90, 2000)

      const data = await response.json()
      updateState({ progress: 100 })

      if (data.success) {
        updateLoadingStates({
          upload: 'complete',
          processing: 'complete',
          download: 'ready'
        })
        
        const result: ConversionResult = {
          success: true,
          message: 'Conversão realizada com sucesso!',
          downloadUrl: response.url, // This would be the blob URL in real implementation
          filename: data.filename
        }
        
        updateState({ result })
        toast.success('Documento convertido com sucesso!', 'Conversão Concluída')
        
        return result
      } else {
        const errorMessage = data.error || 'Erro na conversão.'
        updateLoadingStates({
          upload: 'complete',
          processing: 'error',
          download: 'idle'
        })
        
        const result: ConversionResult = {
          success: false,
          message: errorMessage
        }
        
        updateState({ result })
        toast.error(errorMessage, 'Erro na Conversão')
        
        return result
      }
    } catch (error) {
      console.error('Conversion error:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro de conexão. Verifique se o servidor está rodando.'
      
      updateLoadingStates({
        upload: 'error',
        processing: 'idle',
        download: 'idle'
      })
      
      const result: ConversionResult = {
        success: false,
        message: errorMessage
      }
      
      updateState({ result })
      toast.error(errorMessage, 'Erro de Conexão')
      
      return result
    } finally {
      updateState({ isConverting: false })
    }
  }, [toast, updateState, updateLoadingStates, simulateProgress])

  const downloadFile = useCallback((result: ConversionResult) => {
    if (!result.downloadUrl || !result.filename) return

    const link = document.createElement('a')
    link.href = result.downloadUrl
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    updateLoadingStates({ download: 'complete' })
    toast.success('Download iniciado!', 'Arquivo Baixado')
  }, [updateLoadingStates, toast])

  return {
    ...state,
    convertDocument,
    downloadFile,
    resetState,
    updateState,
    updateLoadingStates
  }
}
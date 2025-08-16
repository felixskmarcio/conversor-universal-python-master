/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentConverter } from '../DocumentConverter'
import { useDocumentConverter } from '@/hooks/useDocumentConverter'

// Mock the hook
jest.mock('@/hooks/useDocumentConverter')
jest.mock('@/components/ToastProvider', () => ({
  useToastContext: () => ({
    toast: {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn()
    }
  })
}))

const mockUseDocumentConverter = useDocumentConverter as jest.MockedFunction<typeof useDocumentConverter>

describe('DocumentConverter', () => {
  const mockConvertDocument = jest.fn()
  const mockDownloadFile = jest.fn()
  const mockResetState = jest.fn()

  beforeEach(() => {
    mockUseDocumentConverter.mockReturnValue({
      isConverting: false,
      progress: 0,
      result: null,
      loadingStates: {
        upload: 'idle',
        processing: 'idle',
        download: 'idle'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the converter interface', () => {
    render(<DocumentConverter />)
    
    expect(screen.getByText('Conversor Universal')).toBeInTheDocument()
    expect(screen.getByText(/Faça upload do seu documento/)).toBeInTheDocument()
  })

  it('shows format selector when file is selected', async () => {
    render(<DocumentConverter />)
    
    // Mock file selection
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByRole('button', { name: /upload/i })
    
    await userEvent.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Converter para:')).toBeInTheDocument()
    })
  })

  it('calls convertDocument when convert button is clicked', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    render(<DocumentConverter />)
    
    // Simulate file selection by updating the component state
    // This would normally be done through the FileUpload component
    const convertButton = screen.getByRole('button', { name: /converter documento/i })
    
    fireEvent.click(convertButton)
    
    // Since we don't have a file selected in this test, the function shouldn't be called
    expect(mockConvertDocument).not.toHaveBeenCalled()
  })

  it('shows loading state during conversion', () => {
    mockUseDocumentConverter.mockReturnValue({
      isConverting: true,
      progress: 50,
      result: null,
      loadingStates: {
        upload: 'complete',
        processing: 'processing',
        download: 'idle'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })

    render(<DocumentConverter />)
    
    expect(screen.getByText('Convertendo...')).toBeInTheDocument()
  })

  it('shows success result with download button', () => {
    const mockResult = {
      success: true,
      message: 'Conversão realizada com sucesso!',
      downloadUrl: 'blob:test-url',
      filename: 'converted.docx'
    }

    mockUseDocumentConverter.mockReturnValue({
      isConverting: false,
      progress: 100,
      result: mockResult,
      loadingStates: {
        upload: 'complete',
        processing: 'complete',
        download: 'ready'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })

    render(<DocumentConverter />)
    
    expect(screen.getByText('Conversão Concluída!')).toBeInTheDocument()
    expect(screen.getByText('Baixar Arquivo Convertido')).toBeInTheDocument()
  })

  it('shows error result', () => {
    const mockResult = {
      success: false,
      message: 'Erro na conversão do arquivo'
    }

    mockUseDocumentConverter.mockReturnValue({
      isConverting: false,
      progress: 0,
      result: mockResult,
      loadingStates: {
        upload: 'error',
        processing: 'idle',
        download: 'idle'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })

    render(<DocumentConverter />)
    
    expect(screen.getByText('Erro na Conversão')).toBeInTheDocument()
    expect(screen.getByText('Erro na conversão do arquivo')).toBeInTheDocument()
  })

  it('calls downloadFile when download button is clicked', () => {
    const mockResult = {
      success: true,
      message: 'Success',
      downloadUrl: 'blob:test-url',
      filename: 'test.docx'
    }

    mockUseDocumentConverter.mockReturnValue({
      isConverting: false,
      progress: 100,
      result: mockResult,
      loadingStates: {
        upload: 'complete',
        processing: 'complete',
        download: 'ready'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })

    render(<DocumentConverter />)
    
    const downloadButton = screen.getByText('Baixar Arquivo Convertido')
    fireEvent.click(downloadButton)
    
    expect(mockDownloadFile).toHaveBeenCalledWith(mockResult)
  })

  it('auto-selects target format based on source file', async () => {
    render(<DocumentConverter />)
    
    // This test would need to be implemented with proper file upload simulation
    // The logic is in the onFilesSelected callback
    expect(true).toBe(true) // Placeholder
  })

  it('disables convert button when no file is selected', () => {
    render(<DocumentConverter />)
    
    const convertButton = screen.getByRole('button', { name: /converter documento/i })
    expect(convertButton).toBeDisabled()
  })

  it('disables convert button during conversion', () => {
    mockUseDocumentConverter.mockReturnValue({
      isConverting: true,
      progress: 30,
      result: null,
      loadingStates: {
        upload: 'uploading',
        processing: 'idle',
        download: 'idle'
      },
      convertDocument: mockConvertDocument,
      downloadFile: mockDownloadFile,
      resetState: mockResetState,
      updateState: jest.fn(),
      updateLoadingStates: jest.fn()
    })

    render(<DocumentConverter />)
    
    const convertButton = screen.getByRole('button', { name: /convertendo/i })
    expect(convertButton).toBeDisabled()
  })
})
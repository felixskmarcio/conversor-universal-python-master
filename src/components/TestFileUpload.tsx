'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export function TestFileUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('onDrop chamado - Arquivos aceitos:', acceptedFiles)
    alert(`${acceptedFiles.length} arquivo(s) selecionado(s): ${acceptedFiles.map(f => f.name).join(', ')}`)
  }, [])

  const onDropRejected = useCallback((rejectedFiles: any[]) => {
    console.log('onDropRejected chamado - Arquivos rejeitados:', rejectedFiles)
    alert(`${rejectedFiles.length} arquivo(s) rejeitado(s)`)
  }, [])

  const onDragEnter = useCallback(() => {
    console.log('onDragEnter chamado')
  }, [])

  const onDragLeave = useCallback(() => {
    console.log('onDragLeave chamado')
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    onDragEnter,
    onDragLeave,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/html': ['.html', '.htm'],
      'text/markdown': ['.md', '.markdown']
    },
    multiple: false,
    maxSize: 16 * 1024 * 1024,
    noClick: false,
    noKeyboard: false
  })

  const handleManualClick = useCallback(() => {
    console.log('Botão manual clicado, abrindo seletor de arquivos...')
    open()
  }, [open])

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Teste de Upload de Arquivo</h2>
      
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Solte o arquivo aqui...' : 'Clique aqui ou arraste um arquivo'}
          </p>
          <p className="text-sm text-gray-500">
            Formatos suportados: PDF, DOCX, DOC, TXT, HTML, MD
          </p>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <button 
          onClick={handleManualClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Abrir Seletor Manual
        </button>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Status:</strong> {isDragActive ? 'Arrastando arquivo' : 'Aguardando'}</p>
          <p>Este é um teste simples para verificar se o react-dropzone está funcionando.</p>
          <p>Se este componente funcionar, o problema está no componente FileUpload principal.</p>
          <p><strong>Instruções:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clique na área de upload acima</li>
            <li>Ou clique no botão "Abrir Seletor Manual"</li>
            <li>Ou arraste um arquivo para a área</li>
            <li>Verifique o console do navegador para logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
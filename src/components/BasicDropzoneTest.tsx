'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export function BasicDropzoneTest() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('BasicDropzoneTest - Arquivos aceitos:', acceptedFiles)
    alert(`BasicDropzoneTest: ${acceptedFiles.length} arquivo(s) selecionado(s)`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const handleClick = () => {
    console.log('Div clicada diretamente')
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Teste Básico do React Dropzone</h2>
      
      {/* Teste 1: Dropzone básico */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Teste 1: Dropzone Básico</h3>
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-blue-500"
        >
          <input {...getInputProps()} />
          <p>{isDragActive ? 'Solte aqui!' : 'Clique ou arraste arquivos aqui'}</p>
        </div>
      </div>

      {/* Teste 2: Div simples com onClick */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Teste 2: Div com onClick Simples</h3>
        <div 
          onClick={handleClick}
          className="border-2 border-solid border-red-300 p-8 text-center cursor-pointer hover:border-red-500"
        >
          <p>Clique aqui para testar onClick básico</p>
        </div>
      </div>

      {/* Teste 3: Input file nativo */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Teste 3: Input File Nativo</h3>
        <input 
          type="file" 
          onChange={(e) => {
            console.log('Input nativo - arquivos:', e.target.files)
            if (e.target.files && e.target.files.length > 0) {
              alert(`Input nativo: ${e.target.files.length} arquivo(s) selecionado(s)`)
            }
          }}
          accept=".pdf,.txt"
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>Este teste verifica três cenários diferentes:</p>
        <ul className="list-disc list-inside mt-2">
          <li>React Dropzone básico</li>
          <li>Div com onClick simples</li>
          <li>Input file nativo</li>
        </ul>
        <p className="mt-2">Verifique o console para logs detalhados.</p>
      </div>
    </div>
  )
}
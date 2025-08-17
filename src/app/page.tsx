'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { FileUpload, FileWithPreview } from '@/components/ui/file-upload'
import { FileUploadFixed } from '@/components/FileUploadFixed'
import { DocumentConverter } from '@/components/DocumentConverter'

import { LoadingAdvanced, LoadingStates } from '@/components/ui/loading-advanced'
import { GradientMeshHero } from '@/components/ui/gradient-mesh'
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileType,
  FileImage,
  FileCode,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StatsSection from '@/components/StatsSection'
import FeaturesSection from '@/components/FeaturesSection'
import { useToastContext } from '@/components/ToastProvider'
import { ParallaxSection, ScrollReveal, FloatingElement } from '@/components/ParallaxSection'
import { ScrollProgress, ScrollToTop } from '@/components/ScrollProgress'

type FileFormat = 'pdf' | 'docx' | 'txt' | 'html' | 'md'

interface ConversionResult {
  success: boolean
  message: string
  downloadUrl?: string
  filename?: string
}

const formatIcons = {
  pdf: FileText,
  docx: FileText,
  txt: FileType,
  html: FileCode,
  md: FileImage
}

export default function ConversorPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [targetFormat, setTargetFormat] = useState<FileFormat>('pdf')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    upload: 'idle',
    processing: 'idle',
    download: 'idle'
  })
  
  const { toast } = useToastContext()

  const selectedFile = selectedFiles[0] || null

  const onFilesSelected = useCallback((files: FileWithPreview[]) => {
    setSelectedFiles(files)
    setResult(null)
    setLoadingStates({
      upload: 'idle',
      processing: 'idle',
      download: 'idle'
    })
    
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
  }, [])

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.warning('Por favor, selecione um arquivo para converter.')
      return
    }

    setIsConverting(true)
    setProgress(0)
    setResult(null)
    setLoadingStates({
      upload: 'uploading',
      processing: 'idle',
      download: 'idle'
    })
    
    toast.info('Iniciando conversão...', 'Processando')

    try {
      // Phase 1: Upload simulation
      for (let i = 0; i <= 30; i += 5) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      setLoadingStates(prev => ({
        ...prev,
        upload: 'complete',
        processing: 'processing'
      }))

      const formData = new FormData()
      formData.append('arquivo', selectedFile)
      formData.append('formato_destino', targetFormat)

      // Construir endpoint da API
      const endpoint = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/converter`
        : (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/converter' : '/converter')
      console.log('Fazendo requisição para:', endpoint)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        // Não definir Content-Type para FormData - o browser define automaticamente
      })

      // Phase 2: Processing simulation
      for (let i = 30; i <= 90; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 150))
      }

      console.log('Status da resposta:', response.status, response.statusText)
      
      if (!response.ok) {
        // Se não for bem-sucedida, tenta ler como JSON para pegar a mensagem de erro
        try {
          const errorData = await response.json()
          throw new Error(`Erro HTTP: ${response.status} - ${errorData.erro || response.statusText}`)
        } catch (jsonError) {
          throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
        }
      }

      // Se chegou aqui, a resposta é bem-sucedida e contém o arquivo
      const blob = await response.blob()
      setProgress(100)

      // Criar URL para download
      const downloadUrl = window.URL.createObjectURL(blob)
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition?.split('filename=')[1] || `arquivo_convertido.${targetFormat}`
      
      // Fazer download automático
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      setLoadingStates({
        upload: 'complete',
          processing: 'complete',
          download: 'ready'
        })
        
        setResult({
          success: true,
          message: 'Conversão realizada com sucesso!',
          downloadUrl: downloadUrl,
          filename: filename
        })
        
        toast.success('Documento convertido com sucesso! O download foi iniciado automaticamente.', 'Conversão Concluída')
    } catch (error) {
      console.error('Conversion error:', error)
      
      let errorMessage = 'Erro desconhecido na conversão'
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend Flask está rodando na porta 5000.'
      } else if (error instanceof Error) {
        if (error.message.includes('HTTP:')) {
          errorMessage = `Erro do servidor: ${error.message}`
        } else {
          errorMessage = `Erro: ${error.message}`
        }
      }
      
      setLoadingStates({
        upload: 'error',
        processing: 'idle',
        download: 'idle'
      })
      
      setResult({
        success: false,
        message: errorMessage
      })
      
      toast.error(errorMessage, 'Erro de Conexão')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result?.downloadUrl || !result?.filename) return

    const link = document.createElement('a')
    link.href = result.downloadUrl
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setLoadingStates(prev => ({
      ...prev,
      download: 'complete'
    }))
    
    toast.success('Download iniciado!', 'Arquivo Baixado')
  }

  return (
    <div className="min-h-screen relative">
      {/* Gradient Mesh Background */}
      <GradientMeshHero className="fixed inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        <ScrollProgress showPercentage={false} />
        <ScrollToTop />
        <Header />
        
        <main>
          {/* Hero Section - Enhanced */}
          <ParallaxSection speed={0.5} className="py-16 sm:py-20 lg:py-24 px-4 relative overflow-hidden">
            {/* Floating elements */}
            <FloatingElement 
              className="hidden sm:block absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
              amplitude={15}
              frequency={4000}
            >
              <div className="w-full h-full" />
            </FloatingElement>
            <FloatingElement 
              className="hidden md:block absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl"
              amplitude={20}
              frequency={3000}
              delay={1000}
            >
              <div className="w-full h-full" />
            </FloatingElement>
            <FloatingElement 
              className="hidden lg:block absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"
              amplitude={12}
              frequency={3500}
              delay={2000}
            >
              <div className="w-full h-full" />
            </FloatingElement>
            
            <ScrollReveal delay={200}>
              <div className="mx-auto max-w-5xl text-center space-y-8 sm:space-y-12 relative z-10">
                <div className="space-y-6 sm:space-y-8">
                  {/* Badge */}
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-md border-white/20 text-foreground">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Conversão Inteligente
                    </Badge>
                  </div>
                  
                  {/* Main heading */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight px-4">
                    Converta Documentos com
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent block sm:inline"> Perfeição</span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
                    Transforme seus documentos entre PDF, DOCX, TXT, HTML e Markdown 
                    com nossa tecnologia de ponta. <span className="text-foreground font-medium">Rápido, seguro e profissional.</span>
                  </p>
                  
                  {/* Feature highlights */}
                  <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-4">
                    {[
                      { icon: Zap, text: 'Conversão Instantânea' },
                      { icon: Shield, text: '100% Seguro' },
                      { icon: Star, text: 'Qualidade Premium' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                        <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </ParallaxSection>



          {/* Converter Section - Enhanced */}
          <ParallaxSection speed={0.3} className="py-12 sm:py-16 lg:py-20 px-4" data-section="converter">
            <ScrollReveal delay={200}>
              <div className="mx-auto max-w-5xl space-y-8 sm:space-y-12">
                {/* Main Converter Card */}
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
                    {/* File Upload Component - Versão Corrigida */}
                    <FileUploadFixed
                      onFilesSelected={onFilesSelected}
                      maxFiles={1}
                      maxSize={16 * 1024 * 1024}
                      showPreview={true}
                      supportedFormats={['PDF', 'DOCX', 'TXT', 'HTML', 'Markdown']}
                      className="rounded-xl"
                    />


                    {/* Format Selection - Enhanced */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <Label className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                            <ArrowRight className="w-5 h-5 text-primary" />
                            Converter para:
                          </Label>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                          {(['pdf', 'docx', 'txt', 'html', 'md'] as FileFormat[]).map((format, index) => {
                            const IconComponent = formatIcons[format]
                            const isSelected = targetFormat === format
                            
                            return (
                              <button
                                key={format}
                                onClick={() => setTargetFormat(format)}
                                className={`
                                  group relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 
                                  text-center space-y-2 sm:space-y-3 overflow-hidden
                                  ${isSelected
                                    ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                                    : 'border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 hover:scale-102'
                                  }
                                  animate-in slide-in-from-bottom-4
                                `}
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                {/* Background glow effect */}
                                <div className={`
                                  absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent 
                                  opacity-0 transition-opacity duration-200
                                  ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}
                                `} />
                                
                                {/* Content */}
                                <div className="relative z-10">
                                  <IconComponent className={`
                                    h-6 w-6 sm:h-8 sm:w-8 mx-auto transition-all duration-200
                                    ${isSelected ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary'}
                                  `} />
                                  <p className="text-sm sm:text-base font-semibold uppercase tracking-wide">
                                    {format}
                                  </p>
                                </div>
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {/* Convert Button - Enhanced */}
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

                    {/* Enhanced Result Display */}
                    {result && (
                      <Card 
                        variant={result.success ? "default" : "outlined"}
                        className={`
                          border-2 transition-all duration-300 animate-in slide-in-from-bottom-4
                          ${result.success 
                            ? 'border-green-400/50 bg-green-50/50 shadow-green-200/50 shadow-lg' 
                            : 'border-red-400/50 bg-red-50/50 shadow-red-200/50 shadow-lg'
                          }
                        `}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`
                              p-3 rounded-full flex-shrink-0
                              ${result.success 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                              }
                            `}>
                              {result.success ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <AlertCircle className="w-6 h-6" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-3">
                              <div>
                                <h3 className={`font-semibold text-lg ${
                                  result.success ? 'text-green-800' : 'text-red-800'
                                }`}>
                                  {result.success ? 'Conversão Concluída!' : 'Erro na Conversão'}
                                </h3>
                                <p className={`text-sm ${
                                  result.success ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {result.message}
                                </p>
                              </div>
                              
                              {result.success && result.downloadUrl && (
                                <Button
                                  onClick={handleDownload}
                                  variant="success"
                                  size="lg"
                                  className="w-full sm:w-auto"
                                  leftIcon={<Download className="w-5 h-5" />}
                                >
                                  Baixar Arquivo Convertido
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Supported Formats */}
                <ScrollReveal delay={400}>
                  <Card 
                    variant="floating" 
                    className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl"
                  >
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
                        <Star className="w-6 h-6 text-primary" />
                        Formatos Suportados
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Conversão bidirecional entre todos os formatos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                          { name: 'PDF', icon: FileText, color: 'from-red-400 to-red-600' },
                          { name: 'DOCX', icon: FileText, color: 'from-blue-400 to-blue-600' },
                          { name: 'TXT', icon: FileType, color: 'from-gray-400 to-gray-600' },
                          { name: 'HTML', icon: FileCode, color: 'from-orange-400 to-orange-600' },
                          { name: 'Markdown', icon: FileImage, color: 'from-purple-400 to-purple-600' }
                        ].map((format, index) => (
                          <ScrollReveal 
                            key={format.name} 
                            delay={500 + index * 100}
                          >
                            <div className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center hover-lift">
                              <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${format.color} flex items-center justify-center`}>
                                <format.icon className="w-6 h-6 text-white" />
                              </div>
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {format.name}
                              </p>
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </ParallaxSection>
        
          {/* Enhanced Stats Section */}
          <ParallaxSection speed={0.2} className="py-16 sm:py-20 relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 backdrop-blur-3xl" />
            
            <ScrollReveal delay={100}>
              <StatsSection />
            </ScrollReveal>
          </ParallaxSection>
          
          {/* Enhanced Features Section */}
          <ParallaxSection speed={0.4} className="py-16 sm:py-20">
            <ScrollReveal delay={200}>
              <FeaturesSection />
            </ScrollReveal>
          </ParallaxSection>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

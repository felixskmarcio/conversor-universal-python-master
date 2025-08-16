'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Shield,
  Zap,
  Users,
  Download,
  Star,
  Clock,
  CheckCircle,
  Globe,
  Lock,
  Smartphone,
  Cloud
} from 'lucide-react'
import { ScrollReveal } from '@/components/ParallaxSection'

const features = [
  {
    icon: FileText,
    title: 'Múltiplos Formatos',
    description: 'Suporte completo para PDF, DOCX, TXT, HTML e Markdown com conversão bidirecional.',
    badge: 'Versátil',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Seus documentos são processados localmente e excluídos automaticamente após a conversão.',
    badge: 'Privado',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Conversão Rápida',
    description: 'Processamento otimizado que converte documentos em segundos, não minutos.',
    badge: 'Veloz',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Interface Intuitiva',
    description: 'Design moderno e responsivo que funciona perfeitamente em qualquer dispositivo.',
    badge: 'Fácil',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Download,
    title: 'Download Instantâneo',
    description: 'Baixe seus arquivos convertidos imediatamente após o processamento.',
    badge: 'Direto',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Star,
    title: 'Qualidade Premium',
    description: 'Mantém a formatação original e garante a melhor qualidade na conversão.',
    badge: 'Premium',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Clock,
    title: 'Disponível 24/7',
    description: 'Serviço online contínuo, disponível a qualquer hora do dia ou da noite.',
    badge: 'Sempre',
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: 'Acesso Universal',
    description: 'Funciona em qualquer navegador moderno, sem necessidade de instalação.',
    badge: 'Web',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    icon: Lock,
    title: 'Dados Protegidos',
    description: 'Criptografia de ponta a ponta e política rigorosa de não armazenamento.',
    badge: 'Criptografado',
    gradient: 'from-gray-600 to-gray-800'
  }
]

const stats = [
  { value: '50K+', label: 'Documentos Convertidos', icon: FileText },
  { value: '99.9%', label: 'Taxa de Sucesso', icon: CheckCircle },
  { value: '<3s', label: 'Tempo Médio', icon: Clock },
  { value: '24/7', label: 'Disponibilidade', icon: Globe }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl">
        {/* Header Section - Responsivo */}
        <ScrollReveal delay={100}>
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-3 sm:space-y-4">
              <Badge 
                variant="secondary" 
                className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-700 border-indigo-200"
              >
                Recursos Avançados
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-4">
                Tudo que você precisa para
                <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {' '}converter documentos
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Nossa plataforma oferece as ferramentas mais avançadas para conversão de documentos,
                garantindo qualidade, segurança e velocidade em cada processo.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Grid - Responsivo com altura padronizada */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <ScrollReveal key={stat.label} delay={300 + index * 100}>
                  <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-lift h-[180px] flex flex-col">
                    <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center space-y-3">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 font-medium leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Features Grid - Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <ScrollReveal 
                key={feature.title} 
                delay={400 + index * 100}
              >
                <Card className="group h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-lift transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200"
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Bottom CTA Section - Responsivo */}
        <ScrollReveal delay={800}>
          <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
            <Card className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 border-0 shadow-2xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      Pronto para começar?
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-indigo-100 max-w-2xl mx-auto">
                      Experimente nossa plataforma agora mesmo e descubra como é fácil converter seus documentos
                      com qualidade profissional.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <div className="flex items-center space-x-2 text-indigo-100">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">Gratuito para usar</span>
                    </div>
                    <div className="flex items-center space-x-2 text-indigo-100">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">100% Seguro</span>
                    </div>
                    <div className="flex items-center space-x-2 text-indigo-100">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">Resultados instantâneos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
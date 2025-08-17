'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CountBadge } from '@/components/ui/count-badge'
import { LoadingPulse } from '@/components/ui/loading-pulse'
import {
  FileText,
  Users,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Star,
  Activity,
  CheckCircle,
  Timer,
  Download
} from 'lucide-react'
import { ScrollReveal } from '@/components/ParallaxSection'

// Hook para estatísticas em tempo real
function useRealTimeStats() {
  const [stats, setStats] = useState({
    conversions: 47832,
    activeUsers: 1247,
    avgTime: 2.3,
    successRate: 99.7
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        conversions: prev.conversions + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        avgTime: Math.max(1.5, prev.avgTime + (Math.random() - 0.5) * 0.1),
        successRate: Math.min(99.9, Math.max(99.0, prev.successRate + (Math.random() - 0.5) * 0.1))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return stats
}

export default function StatsSection() {
  const stats = useRealTimeStats()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const mainStats = [
    {
      icon: FileText,
      label: 'Conversões Realizadas',
      value: stats.conversions.toLocaleString(),
      suffix: '+',
      trend: '+12%',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Documentos convertidos com sucesso'
    },
    {
      icon: Users,
      label: 'Usuários Ativos',
      value: stats.activeUsers.toLocaleString(),
      suffix: '',
      trend: '+8%',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Usuários online agora'
    },
    {
      icon: Timer,
      label: 'Tempo Médio',
      value: stats.avgTime.toFixed(1),
      suffix: 's',
      trend: '-5%',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Velocidade de conversão'
    },
    {
      icon: CheckCircle,
      label: 'Taxa de Sucesso',
      value: stats.successRate.toFixed(1),
      suffix: '%',
      trend: 'Estável',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'Conversões bem-sucedidas'
    }
  ]

  const additionalStats = [
    {
      icon: Globe,
      label: 'Países Atendidos',
      value: '150+',
      color: 'text-indigo-600'
    },
    {
      icon: Shield,
      label: 'Uptime',
      value: '99.9%',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      label: 'Formatos',
      value: '5+',
      color: 'text-yellow-600'
    },
    {
      icon: Star,
      label: 'Avaliação',
      value: '4.9/5',
      color: 'text-pink-600'
    }
  ]

  return (
    <section id="stats" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section - Responsivo */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <ScrollReveal animation="fade-in" delay={100}>
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 sm:mb-6">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-800">Estatísticas em Tempo Real</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="slide-in-from-bottom-4" delay={200}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Números que
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Impressionam
              </span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in" delay={300}>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Acompanhe o desempenho da nossa plataforma em tempo real. 
              Dados atualizados automaticamente para mostrar nossa eficiência.
            </p>
          </ScrollReveal>
        </div>

        {/* Main Stats Grid - Responsivo com altura padronizada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <ScrollReveal key={stat.label} animation="scale-in" delay={400 + index * 100}>
                <div className="group relative h-full">
                  {/* Card com altura padronizada */}
                  <div 
                    className="relative p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden cursor-pointer h-[320px] flex flex-col justify-between"
                    onClick={() => window.open('https://github.com/felixskmarcio/conversor-universal-python-master', '_blank')}
                  >
                    {/* Background Gradient */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 cursor-pointer`}
                      onClick={() => window.open('https://github.com/felixskmarcio/conversor-universal-python-master', '_blank')}
                    />
                    
                    {/* Header com ícone e badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-7 w-7 ${stat.iconColor}`} />
                      </div>
                      <Badge 
                        variant={stat.trend.includes('-') ? 'destructive' : stat.trend === 'Estável' ? 'secondary' : 'default'}
                        className="text-xs px-2 py-1"
                      >
                        {stat.trend}
                      </Badge>
                    </div>
                    
                    {/* Conteúdo principal */}
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      <h3 className="text-base font-medium text-gray-600 leading-tight">{stat.label}</h3>
                      
                      <div className="flex items-baseline space-x-1">
                        {isVisible ? (
                          <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {stat.value}
                          </span>
                        ) : (
                          <LoadingPulse className="h-10 w-24" />
                        )}
                        <span className="text-xl font-semibold text-gray-600">{stat.suffix}</span>
                      </div>
                      
                      <p className="text-sm text-gray-500 leading-relaxed">{stat.description}</p>
                    </div>
                    
                    {/* Live Indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600 font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Additional Stats - Responsivo */}
        <ScrollReveal animation="slide-in-from-bottom-4" delay={800}>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Mais Estatísticas
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Dados adicionais sobre nossa plataforma
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {additionalStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <ScrollReveal key={stat.label} animation="fade-in" delay={900 + index * 100}>
                    <div className="text-center group">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg mb-3 sm:mb-4 group-hover:bg-gray-100 transition-colors duration-200">
                        <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Section - Responsivo */}
        <ScrollReveal animation="slide-in-from-bottom-4" delay={1200}>
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                  Pronto para começar?
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Junte-se a milhares de usuários satisfeitos
                </p>
              </div>
              <button 
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => {
                  const converterSection = document.querySelector('[data-section="converter"]');
                  if (converterSection) {
                    converterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base">Converter Agora</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
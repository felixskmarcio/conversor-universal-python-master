'use client'

import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  Code,
  Users,
  Star,
  Download,
  Clock,
  Lock
} from 'lucide-react'
import { ScrollReveal } from '@/components/ParallaxSection'

const supportedFormats = [
  { name: 'PDF', description: 'Portable Document Format' },
  { name: 'DOCX', description: 'Microsoft Word Document' },
  { name: 'TXT', description: 'Plain Text File' },
  { name: 'HTML', description: 'HyperText Markup Language' },
  { name: 'MD', description: 'Markdown Document' }
]

const features = [
  { icon: Shield, name: 'Seguro', description: 'Criptografia de ponta' },
  { icon: Zap, name: 'Rápido', description: 'Conversão em segundos' },
  { icon: Globe, name: 'Universal', description: 'Funciona em qualquer lugar' },
  { icon: Lock, name: 'Privado', description: 'Sem armazenamento' }
]

const quickStats = [
  { label: 'Conversões', value: '50K+', icon: FileText },
  { label: 'Usuários', value: '10K+', icon: Users },
  { label: 'Uptime', value: '99.9%', icon: Clock },
  { label: 'Formatos', value: '5+', icon: Star }
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/felixskmarcio/conversor-universal-python', label: 'GitHub', color: 'hover:text-gray-900' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-500' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
  { icon: Mail, href: '#', label: 'Email', color: 'hover:text-red-500' }
]

const quickLinks = [
  { name: 'Converter Documentos', href: '[data-section="converter"]' },
  { name: 'Estatísticas', href: '#stats' },
  { name: 'Recursos', href: '#features' }
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section - Responsivo */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <ScrollReveal delay={100}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">DocConverter</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Conversão Profissional</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  A plataforma mais avançada para conversão de documentos. 
                  Rápido, seguro e confiável.
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="online" text="Online" className="text-xs" />
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Seguro
                  </Badge>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Supported Formats - Responsivo */}
          <div className="space-y-4 sm:space-y-6">
            <ScrollReveal delay={200}>
              <h4 className="text-lg sm:text-xl font-semibold text-white">Formatos Suportados</h4>
            </ScrollReveal>
            <div className="space-y-3">
              {supportedFormats.map((format, index) => (
                <ScrollReveal key={format.name} delay={250 + index * 50}>
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm sm:text-base text-white">{format.name}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{format.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      Ativo
                    </Badge>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Features & Stats - Responsivo */}
          <div className="space-y-6 sm:space-y-8">
            {/* Features */}
            <div className="space-y-4">
              <ScrollReveal delay={300}>
                <h4 className="text-lg sm:text-xl font-semibold text-white">Recursos</h4>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <ScrollReveal key={feature.name} delay={350 + index * 75}>
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md">
                          <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-white">{feature.name}</div>
                          <div className="text-xs text-gray-400">{feature.description}</div>
                        </div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <ScrollReveal delay={500}>
                <h4 className="text-lg sm:text-xl font-semibold text-white">Estatísticas</h4>
              </ScrollReveal>
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <ScrollReveal key={stat.label} delay={550 + index * 75}>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex justify-center mb-2">
                          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Links & Social - Responsivo */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <ScrollReveal delay={600}>
                <h4 className="text-lg sm:text-xl font-semibold text-white">Links Rápidos</h4>
              </ScrollReveal>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {quickLinks.map((link, index) => (
                  <ScrollReveal key={link.name} delay={650 + index * 50}>
                    <a
                      href={link.href}
                      className="block text-sm sm:text-base text-gray-300 hover:text-white transition-colors py-1 sm:py-2 hover:translate-x-1 transform duration-200"
                    >
                      {link.name}
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <ScrollReveal delay={800}>
                <h4 className="text-lg sm:text-xl font-semibold text-white">Conecte-se</h4>
              </ScrollReveal>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <ScrollReveal key={social.label} delay={850 + index * 100}>
                      <a 
                        href={social.href} 
                        aria-label={social.label}
                        className={`inline-flex items-center justify-center p-2 sm:p-3 text-gray-400 ${social.color} transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>

            {/* CTA Button */}
            <ScrollReveal delay={1000}>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm sm:text-base py-2 sm:py-3"
                onClick={() => {
                  const converterSection = document.querySelector('[data-section="converter"]');
                  if (converterSection) {
                    converterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Começar Agora
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Responsivo */}
      <div className="border-t border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <ScrollReveal delay={1100}>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-400">
                  © 2024 DocConverter. Todos os direitos reservados.
                </p>
                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400">
                  <span>Feito com</span>
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                  <span>por desenvolvedores brasileiros</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacidade
                </a>
                <span className="hidden sm:inline">•</span>
                <a href="#terms" className="hover:text-white transition-colors">
                  Termos
                </a>
                <span className="hidden sm:inline">•</span>
                <a href="#support" className="hover:text-white transition-colors">
                  Suporte
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/Navigation'
import { StatusBadges } from '@/components/StatusBadges'
import { CTAButtons } from '@/components/CTAButtons'
import { QuickStats } from '@/components/QuickStats'
import {
  Menu,
  X,
  FileText
} from 'lucide-react'
import { ScrollReveal } from '@/components/ParallaxSection'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="relative bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo e Título - Responsivo */}
          <ScrollReveal delay={100}>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  DocConverter
                </h1>
                <p className="hidden sm:block text-xs text-gray-500">
                  Conversão Profissional
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation Desktop - Oculto em mobile */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <ScrollReveal delay={200}>
              <Navigation variant="desktop" />
            </ScrollReveal>
          </div>

          {/* Status Badges Desktop - Oculto em mobile */}
          <div className="hidden xl:flex items-center space-x-3">
            <ScrollReveal delay={300}>
              <StatusBadges variant="desktop" />
            </ScrollReveal>
          </div>

          {/* CTA Buttons Desktop - Responsivo */}
          <div className="hidden md:flex">
            <ScrollReveal delay={300}>
              <CTAButtons variant="desktop" />
            </ScrollReveal>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Responsivo */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links Mobile */}
              <Navigation 
                variant="mobile" 
                onItemClick={() => setIsMenuOpen(false)}
              />

              {/* Status Badges Mobile */}
              <StatusBadges variant="mobile" />

              {/* CTA Buttons Mobile */}
              <CTAButtons 
                variant="mobile" 
                onStartClick={() => setIsMenuOpen(false)}
              />

              {/* Quick Stats Mobile */}
              <QuickStats />
            </div>
          </div>
        )}
      </div>

      {/* Subtle gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
    </header>
  )
}
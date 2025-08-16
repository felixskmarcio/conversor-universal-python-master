'use client'

import { cn } from '@/lib/utils'

// Dados de navegação centralizados
export const navigationItems = [
  {
    id: 'converter',
    label: 'Converter',
    href: '#converter',
    description: 'Converter Documentos'
  },
  {
    id: 'stats',
    label: 'Estatísticas',
    href: '#stats',
    description: 'Estatísticas em Tempo Real'
  },
  {
    id: 'features',
    label: 'Recursos',
    href: '#features',
    description: 'Recursos e Funcionalidades'
  }
]

interface NavigationProps {
  variant?: 'desktop' | 'mobile'
  onItemClick?: () => void
  className?: string
}

export function Navigation({ 
  variant = 'desktop', 
  onItemClick,
  className 
}: NavigationProps) {
  const handleClick = (href: string) => {
    // Smooth scroll para a seção
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
    
    // Callback para fechar menu mobile se necessário
    onItemClick?.()
  }

  if (variant === 'mobile') {
    return (
      <nav className={cn('space-y-3', className)} role="navigation" aria-label="Navegação principal">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.href)}
            className="block w-full text-left text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
            aria-label={`Navegar para ${item.description}`}
          >
            {item.description}
          </button>
        ))}
      </nav>
    )
  }

  return (
    <nav 
      className={cn(
        'flex items-center space-x-4 xl:space-x-6',
        className
      )} 
      role="navigation" 
      aria-label="Navegação principal"
    >
      {navigationItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.href)}
          className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1 relative group"
          aria-label={`Navegar para ${item.description}`}
        >
          {item.label}
          {/* Indicador visual hover */}
          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
        </button>
      ))}
    </nav>
  )
}

export default Navigation
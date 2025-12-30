'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessageCircle,
  AlertTriangle,
  AlertCircle,
  Eye,
  HelpCircle,
  Settings,
  Building2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConsoleSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/console/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Chat',
    href: '/console/chat',
    icon: MessageCircle,
  },
  {
    name: 'Brownout',
    href: '/console/brownout',
    icon: AlertTriangle,
  },
  {
    name: 'Incidents',
    href: '/console/incidents',
    icon: AlertCircle,
  },
  {
    name: 'Observability',
    href: '/console/observability',
    icon: Eye,
  },
  {
    name: 'Help',
    href: '/console/help',
    icon: HelpCircle,
  },
  {
    name: 'Settings',
    href: '/console/settings',
    icon: Settings,
  },
]

export function ConsoleSidebar({ isOpen, onClose }: ConsoleSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">open-Balancer</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>open-Balancer Console</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
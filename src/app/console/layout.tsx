'use client'

import { useState } from 'react'
import { ConsoleHeader } from '@/components/console/console-header'
import { ConsoleSidebar } from '@/components/console/console-sidebar'
import ProtectedRoute from '@/components/auth/protected-route'

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <ConsoleSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="lg:pl-64">
          <ConsoleHeader onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
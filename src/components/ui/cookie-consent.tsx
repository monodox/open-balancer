'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
    
    // Enable analytics and other cookies here
    console.log('Cookies accepted - enabling analytics')
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
    
    // Disable non-essential cookies
    console.log('Cookies declined - only essential cookies enabled')
  }

  const handleClose = () => {
    setShowBanner(false)
    // Don't save preference, will show again on next visit
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-2 bg-white">
        <div className="flex items-start space-x-3">
          <Cookie className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              We use cookies
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
              Essential cookies are required for authentication and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <Button 
                onClick={handleAccept}
                size="sm"
                className="text-xs px-3 py-1.5"
              >
                Accept All
              </Button>
              <Button 
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="text-xs px-3 py-1.5"
              >
                Essential Only
              </Button>
            </div>
            <Link 
              href="/legal/cookies"
              className="text-xs text-blue-600 hover:underline"
            >
              Learn more about our cookies
            </Link>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  )
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent')
    setConsent(cookieConsent as 'accepted' | 'declined' | null)
  }, [])

  return {
    consent,
    hasConsented: consent !== null,
    canUseAnalytics: consent === 'accepted',
    canUseMarketing: consent === 'accepted'
  }
}
'use client'

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cookie, Shield, BarChart3, Settings, CheckCircle } from 'lucide-react'

export default function CookiesPage() {
  const [cookieConsent, setCookieConsent] = useState<string | null>(null)

  useEffect(() => {
    setCookieConsent(localStorage.getItem('cookieConsent'))
  }, [])

  const handleUpdateConsent = (consent: 'accepted' | 'declined') => {
    localStorage.setItem('cookieConsent', consent)
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setCookieConsent(consent)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <Cookie className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="mt-2 text-gray-600">
              Last updated: December 30, 2024
            </p>
            {cookieConsent && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                Current preference: {cookieConsent === 'accepted' ? 'All cookies accepted' : 'Essential cookies only'}
              </div>
            )}
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Essential Cookies (Always Active)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They are usually only set in response to actions made by you which amount to a request for services.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Authentication and login sessions</li>
                    <li>• Security and fraud prevention</li>
                    <li>• Load balancing and performance</li>
                    <li>• Cookie consent preferences</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Analytics Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve the user experience.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What we track:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Page views and navigation patterns</li>
                    <li>• Time spent on pages</li>
                    <li>• Error rates and performance metrics</li>
                    <li>• Feature usage in the console</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  Preference Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  These cookies remember your settings and preferences to provide a personalized experience 
                  when you return to our website.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What we remember:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Dashboard layout preferences</li>
                    <li>• Theme and display settings</li>
                    <li>• Language preferences</li>
                    <li>• Notification settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Update Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You can change your cookie preferences at any time. Note that disabling certain cookies 
                may affect the functionality of our website.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => handleUpdateConsent('accepted')}
                  variant={cookieConsent === 'accepted' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Accept All Cookies
                </Button>
                <Button 
                  onClick={() => handleUpdateConsent('declined')}
                  variant={cookieConsent === 'declined' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Essential Cookies Only
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="prose max-w-none p-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies</h2>
                  <p className="text-gray-600">
                    Cookies are small text files that are stored on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and 
                    improving our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
                  <p className="text-gray-600 mb-4">
                    We use the following third-party services that may set cookies:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li><strong>Datadog:</strong> For application monitoring and observability</li>
                      <li><strong>Google Cloud:</strong> For infrastructure and hosting services</li>
                      <li><strong>OpenTelemetry:</strong> For telemetry data collection</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies in Your Browser</h2>
                  <p className="text-gray-600 mb-4">
                    You can control and manage cookies through your browser settings:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                      <li>• <strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                      <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                      <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h2>
                  <p className="text-gray-600">
                    Cookie data is retained for different periods depending on the type:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Session cookies:</strong> Deleted when you close your browser</li>
                      <li>• <strong>Authentication cookies:</strong> 24 hours or until logout</li>
                      <li>• <strong>Preference cookies:</strong> Up to 1 year</li>
                      <li>• <strong>Analytics cookies:</strong> Up to 2 years</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                  <p className="text-gray-600">
                    If you have any questions about our Cookie Policy, please contact us at{' '}
                    <a href="mailto:privacy@open-balancer.org" className="text-primary hover:underline">
                      privacy@open-balancer.org
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}
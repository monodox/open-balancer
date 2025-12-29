import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cookie } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <Cookie className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="mt-2 text-gray-600">
              Last updated: December 29, 2024
            </p>
          </div>

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
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                      <p className="text-gray-600">
                        Required for the website to function properly, including authentication and security features.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                      <p className="text-gray-600">
                        Help us understand how visitors interact with our website to improve user experience.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Preference Cookies</h3>
                      <p className="text-gray-600">
                        Remember your settings and preferences for a personalized experience.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
                  <p className="text-gray-600">
                    You can control and manage cookies through your browser settings. Please note that 
                    disabling certain cookies may affect the functionality of our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                  <p className="text-gray-600">
                    If you have any questions about our Cookie Policy, please contact us at{' '}
                    <a href="mailto:privacy@authapp.com" className="text-primary hover:underline">
                      privacy@authapp.com
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